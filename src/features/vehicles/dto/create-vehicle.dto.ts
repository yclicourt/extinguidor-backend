import { TipoVehiculo } from "generated/prisma/client"


export class CreateVehicleDto {
    type: TipoVehiculo
    matricule:string
}
