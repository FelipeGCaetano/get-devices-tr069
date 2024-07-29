import DeviceService from "../service/device.service.js";
class DeviceController {
    async getAssociatedDevicesBySn(req, res){
        const { serialNumber } = req.params;
        
        const deviceService = new DeviceService();
        const associatedDevices = await deviceService.getAssociatedDevicesBySn(serialNumber);

        if(associatedDevices.err) return res.status(400).json({
            status: "error",
            message: associatedDevices.err
        })

        return res.status(200).json(associatedDevices);
    }
}

export default DeviceController