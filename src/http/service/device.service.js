import GenieAPI from '../../common/genieacs.js'

const genie = new GenieAPI()

class DeviceService {
    async getAssociatedDevicesBySn(serialNumber) {
        try {
            const query = {
                "_deviceId._SerialNumber": serialNumber
            }
    
            const getDeviceId = await genie.getDevices({ query: JSON.stringify(query) })
            
            if(getDeviceId.length === 0) throw new Error("Dispositivo não encontrado")
    
            const deviceId = getDeviceId[0]._id
    
            const updateParams = await genie.refreshObject({
                deviceId: deviceId,
                objectName: 'InternetGatewayDevice.LANDevice.1.Hosts.Host',
                connectionRequest: true
            })

            const getHosts = await genie.getDeviceById({
                deviceId: deviceId,
                fields: [
                    'InternetGatewayDevice.LANDevice.1.Hosts.Host'
                ]
            })
    
            const hosts = getHosts[0].InternetGatewayDevice.LANDevice["1"].Hosts.Host
    
            const associatedDevices = []
    
            for(let host in hosts) {
                if(!host.startsWith("_")) {
                    let connectionType = (hosts[host].Layer2Interface._value)

                    if(connectionType.includes('LANEthernetInterfaceConfig')) {
                        connectionType = 'cabeado'
                    } else {
                        connectionType = connectionType.split('.')
                        if(connectionType[4] == 1) {
                            connectionType = "wireless - 2.4G"
                        } else {
                            connectionType = "wireless - 5G"
                        }
                    }

                    associatedDevices.push({
                        online: hosts[host].Active._value,
                        name: hosts[host].HostName._value,
                        ip: hosts[host].IPAddress._value,
                        mac: hosts[host].MACAddress._value,
                        connectionType
                    })
                }
            }
    
            return {
                status: "success",
                message: "Dispositivos associados",
                data: associatedDevices
            }

        } catch(err) {
            return {err: err.message}
        }
    } 
}

export default DeviceService