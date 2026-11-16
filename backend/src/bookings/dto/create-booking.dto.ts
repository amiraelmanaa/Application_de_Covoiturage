import { IsNotEmpty, IsString, IsUUID, isUUID } from "class-validator";

export class CreateBookingDto {
    @IsUUID()
    journeyId: string;

    @IsString() @IsNotEmpty()
    passengerId: string; //later it will come from teh jwt token
}