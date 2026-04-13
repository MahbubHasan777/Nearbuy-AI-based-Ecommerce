export declare enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHER = "OTHER"
}
export declare class CreateCustomerDto {
    username: string;
    email: string;
    password: string;
    fullName: string;
    address: string;
    gender: Gender;
    phone: string;
}
