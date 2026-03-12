import {useFormik} from "formik";
import {teamSessionSchema} from "../../../utils/validationSchema";
import {Video} from "lucide-react"
import React, {use} from "react";
import Header from "../../shared/text/Header";
import AppInput from "../../shared/input/AppInput";
import CustomSelect from "../../shared/custom-select";
import {handleSelectionOnChange} from "../../../utils/helpers";
import SolidButton from "../../shared/buttons/SolidButton";

const CreateZoomMeeting=()=>{
    const initialValues = {
        students: "",
        title: "",
        link: "",
        description: "",
    }

    const formik = useFormik({
        initialValues,
        validationSchema: teamSessionSchema,
        onSubmit: values => {
            console.log(values)
        }
    })

    const renderError = (name) => {
        return formik.touched[name] && formik.errors[name] ? (
            <div className="mt-1 text-sm text-red-500">{formik.errors[name]}</div>
        ) : null;
    };

    return (
        <div className={"border border-gray-300 p-4 rounded-md"}>
            <Header
                title={"Create Teams/Zoom Session"}
                subtitle={"Share a zoom link with your students"}
            />

            <form
                onSubmit={formik.handleSubmit}
                className={"space-y-6"}
            >
                <div>
                    <label className={"text-blue-900 mb-1.5 font-semibold"}>
                        Select Student
                    </label>
                    <CustomSelect
                        onChange={option => handleSelectionOnChange(option , "students", formik)}
                        value={formik.values.students}
                        options={[
                            {
                                value: "all",
                                label: "Select the entire students or a particular student",
                            },
                            // ...studentOptions,
                        ]}
                    />
                    {renderError("students")}
                </div>

                <AppInput
                    label={"Session Title"}
                    name={"title"}
                    formik={formik}
                    type={"text"}
                    placeholder={"e.g., Progress Review Meeting"}
                />

                <AppInput
                    label={"Teams/Zoom Link"}
                    name={"link"}
                    formik={formik}
                    type={"url"}
                    placeholder={"Teams/Zoom Link"}
                />

                <AppInput
                    label={" Description (Optional)"}
                    name={"description"}
                    formik={formik}
                    type={"text"}
                    as={"textarea"}
                    placeholder={"Meeting agenda or additional notes..."}
                />

                <div className={"mt-3"}>
                    <SolidButton
                        Icon={<Video />}
                        title={formik.isSubmitting ? 'Creating...' : 'Create Session'}
                        type="submit"
                        disabled={formik.isSubmitting}
                        className='py-2 w-full'
                    />
                </div>
            </form>

        </div>
    )
}

export default CreateZoomMeeting;