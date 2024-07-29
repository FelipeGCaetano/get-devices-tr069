import fetch from "node-fetch";
import { config } from "dotenv";
config()

const genieUrl = process.env.GENIE_URL
const token = process.env.NBI_TOKEN

class GenieAPI {
    async getDevices({query}) {
        const url = query ? encodeURI(`${genieUrl}/devices/?query=${query}`) : encodeURI(`${genieUrl}/devices/`)

        const opt = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": token
            }
        };

        const requestQueryParam = await fetch(url, opt) 
        const queryParam = await requestQueryParam.json()

        return queryParam
    }

    async getDeviceById({deviceId, fields}) {
        const query = JSON.stringify({
            _id: `/${deviceId}/`
        })

        const url = fields ? encodeURI(`${genieUrl}/devices/?query=${query}&projection=${fields}`) : encodeURI(`${genieUrl}/devices/?query=${query}`)

        const opt = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": token
            }
        };

        const requestQueryParam = await fetch(url, opt) 
        const queryParam = await requestQueryParam.json()

        if(queryParam.length == 0) 
            throw new Error("Dispositivo não encontrado", 404)

        return queryParam
    }

    async refreshObject({deviceId, objectName, connectionRequest}) {
        const url = encodeURI(`${genieUrl}/devices/${deviceId}/tasks${connectionRequest ? "?connection_request": ""}`);

        const opt = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": token
            },
            body: JSON.stringify({
                name: "refreshObject",
                objectName
            })
        };

        const requestRefreshObject = await fetch(url, opt);

        if (requestRefreshObject.status == 404) {
            throw new Error("Dispositivo não encontrado.", 404)
        };
        if (requestRefreshObject.status == 202 && connectionRequest) {
            throw new Error("Erro ao atualizar parâmetros pela API. Dispositivo provavelmente está off-line", 500)
        };
        if (requestRefreshObject.status != 200 && connectionRequest) {
            throw new Error("Erro ao atualizar parâmetros pela API.", 500)
        };
        if (requestRefreshObject.status != 202 && !connectionRequest) {
            throw new Error("Erro ao atualizar parâmetros pela API.", 500)
        };

        // GenieACS API will return only a "_id" property on the JSON response if any error occurs.
        // This ID is the fault identifier
        const refreshObject = await requestRefreshObject.json()
        if (!refreshObject.name) {
            throw new Error("Erro ao atualizar parâmetros pela API.", 500)
        };

        return refreshObject;
    }
}

export default GenieAPI;