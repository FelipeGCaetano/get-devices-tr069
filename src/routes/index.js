import { Router } from "express";
import DeviceController from "../http/controller/device.controller.js";


const Routes = Router()
const controller = new DeviceController()

Routes.get("/acs/:serialNumber/associated-devices", controller.getAssociatedDevicesBySn)

export default Routes