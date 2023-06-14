import { LoaderArgs, json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import styles from "react-toastify/dist/ReactToastify.css";
import { z } from "zod";
import { userPrefs } from "~/cookies";
import { ApiCall } from "~/services/api";

export function links() {
    return [{ rel: "stylesheet", href: styles }];
}

export async function loader({ params, request }: LoaderArgs) {
    const cookieHeader = request.headers.get("Cookie");
    const cookie: any = await userPrefs.parse(cookieHeader);
    return json({ token: cookie.token, userId: cookie.id });
}


const AddLicense: React.FC = (): JSX.Element => {
    const userId = useLoaderData().userId;
    const token = useLoaderData().token;
    const navigator = useNavigate();


    const lType = useRef<HTMLSelectElement>(null);
    const paymentamount = useRef<HTMLInputElement>(null);
    const discountamount = useRef<HTMLInputElement>(null);
    const discountvalid = useRef<HTMLInputElement>(null);
    const questionallowed = useRef<HTMLInputElement>(null);
    const projectperlicense = useRef<HTMLInputElement>(null);


    const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const numericValue = inputValue.replace(/[^0-9]/g, '');
        e.target.value = numericValue;
    };


    const addLicense = async () => {
        const LicenseScheme = z
            .object({
                licenseType: z
                    .string()
                    .nonempty("License Type is required."),
                paymentAmount: z
                    .number({
                        required_error: "License Payment Amount is required.",
                        invalid_type_error: "License Payment Amount should be valid."
                    }),
                discountAmount: z
                    .number({
                        required_error: "License Discount Amount is required.",
                        invalid_type_error: "License Discount Amount should be valid."
                    }),
                discountValidTill: z
                    .date({ required_error: "Discount Till Valid is required", invalid_type_error: "Discount Till Valid Should be a valid date" }),
                // .datetime("Discount Till Valid Should be a valid date")
                // .nonempty("Discount Till Valid is required"),
                questionAllowed: z
                    .number({
                        required_error: "License Question Allowed is required.",
                        invalid_type_error: "License Question Allowed should be valid."
                    }),
                projectPerLicense: z
                    .number({
                        required_error: "Project Per License is required.",
                        invalid_type_error: "Project Per License should be valid."
                    }),
            })
            .strict();

        type LicenseScheme = z.infer<typeof LicenseScheme>;

        const licenseScheme: LicenseScheme = {
            licenseType: lType!.current!.value,
            paymentAmount: parseInt(paymentamount!.current!.value),
            discountAmount: parseInt(discountamount!.current!.value),
            discountValidTill: new Date(discountvalid!.current!.value),
            questionAllowed: parseInt(questionallowed!.current!.value),
            projectPerLicense: parseInt(projectperlicense!.current!.value),
        };

        const parsed = LicenseScheme.safeParse(licenseScheme);

        if (parsed.success) {
            const data = await ApiCall({
                query: `
                    mutation createLicense($createLicenseInput:CreateLicenseInput!){
                        createLicense(createLicenseInput:$createLicenseInput){
                          id
                        }
                      }
                  `,
                veriables: {
                    createLicenseInput: licenseScheme
                },
                headers: { authorization: `Bearer ${token}` },
            });

            if (!data.status) {
                toast.error(data.message, { theme: "light" });
            } else {
                navigator("/home/license/");
            }
        }
        else {
            toast.error(parsed.error.errors[0].message, { theme: "light" });
        }
    };
    return (<>
        <div className="grow w-full bg-[#272934] p-4  ">
            <h1 className="text-white font-medium text-2xl">Add New License</h1>
            <div className="bg-gray-400 w-full h-[2px] my-2"></div>


            <h2 className="text-white font-semibold text-md">
                <span className="text-green-500 pr-2">&#x2666;</span>
                License Type
            </h2>

            <select ref={lType} defaultValue={"0"} className="px-4 bg-transparent fill-none outline-none border-2 border-white text-white py-2 w-96 my-2">
                <option value="0" className="bg-[#272934] text-white text-lg " disabled>Select License Type</option>
                <option className="bg-[#272934] text-white text-lg" value="FREE">FREE</option>
                <option className="bg-[#272934] text-white text-lg" value="BUSINESS">BUSINESS</option>
                <option className="bg-[#272934] text-white text-lg" value="PREMIUM">PREMIUM</option>
                <option className="bg-[#272934] text-white text-lg" value="PLATINUM">PLATINUM</option>
            </select>

            <h2 className="text-white font-semibold text-md">
                <span className="text-green-500 pr-2">&#x2666;</span>
                Payment License Amount
            </h2>
            <input
                ref={paymentamount}
                className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300"
                placeholder="Enter License Amount"
                onInput={handleNumberInput}
            />
            <h2 className="text-white font-semibold text-md">
                <span className="text-green-500 pr-2">&#x2666;</span>
                License Discount Amount
            </h2>
            <input
                ref={discountamount}
                className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300"
                placeholder="License Discount Amount"
                onInput={handleNumberInput}
            />
            <h2 className="text-white font-semibold text-md">
                <span className="text-green-500 pr-2">&#x2666;</span>
                Discorunt Valid Till Date
            </h2>
            <input
                type="date"
                ref={discountvalid}
                className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300"
                placeholder="Enter License Discount Valid Till Date"
            />
            <h2 className="text-white font-semibold text-md">
                <span className="text-green-500 pr-2">&#x2666;</span>
                Question Allowed
            </h2>
            <input
                ref={questionallowed}
                className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300"
                placeholder="Enter Question Allowed In This License"
                onInput={handleNumberInput}
            />
            <h2 className="text-white font-semibold text-md">
                <span className="text-green-500 pr-2">&#x2666;</span>
                Project Per License
            </h2>
            <input
                ref={projectperlicense}
                className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300"
                placeholder="Enter License Project Per License"
                onInput={handleNumberInput}
            />
            <div></div>
            <button
                onClick={addLicense}
                className="text-center py-2 px-4 text-white bg-emerald-500 font-semibold rounded mt-4"
            >
                SUBMIT
            </button>
        </div>
        <ToastContainer></ToastContainer>
    </>);
}

export default AddLicense;