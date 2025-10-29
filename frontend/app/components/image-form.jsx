"use client";
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { fileSchema } from "../api/submit" 
import { imageSubmit } from "../api/submit";
import { useState } from "react";
import Image from "next/image";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const allowedExtensions = ["jpeg", "jpg", "png", "webp"];

export default function ImageForm() {
    const [response, setResponse] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isValidFile, setIsValidFile] = useState(false); 

    const form = useForm({
        resolver: zodResolver(fileSchema),
        defaultValues: {
            file: undefined,
        }
    });

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]; 
        
        if (file) {
            const extension = file.name.split(".").pop().toLowerCase();
            if (!allowedExtensions.includes(extension)) {
                toast.error("Only jpg, png and webp files are allowed");
                setIsValidFile(false);
                setPreview(null);
                return;
            }            
            
            if (preview) {
                URL.revokeObjectURL(preview);
            }
            
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
            setIsValidFile(true);
        } else {
            setIsValidFile(false);
        }
    };
 
    async function onSubmit(values) {
        const result = await imageSubmit(values);
        if (result.status === 'uncompatible') {
            toast.error('Only images allowed');
        }
        else if (result.status === 'error') {
            toast.error(result.message);
        }
        else {
            toast.success("Submitted");
            setResponse(result);
        }    
    }

    return (
        <>
            {preview && (
                <div className="relative border rounded-lg h-50 w-40 sm:h-150 sm:w-200 aspect-4/3">
                    <Image 
                        src={preview} 
                        alt="Preview" 
                        fill
                        className="object-cover rounded-lg w-fit h-fit"
                    />
                </div>
            )}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="file"
                        render={({ field: { onChange, value, ...field } }) => (
                            <FormItem>
                                <FormLabel>File</FormLabel>
                                <FormControl>
                                    <Input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={(e) => {
                                            onChange(e.target.files);
                                            handleFileChange(e);
                                        }}
                                        {...field}
                                        value={undefined}
                                    />
                                </FormControl>
                                <FormDescription>
                                    This image will be predicted.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button 
                        type="submit"
                        disabled={!isValidFile || form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? (
                            <>
                                Submitting... <Spinner className="size-6 text-purple-500" />
                            </>
                        ) : (
                            "Submit"
                        )}
                    </Button>
                </form>
            </Form>
            {response && (
                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle>Result</CardTitle>
                        <CardDescription>Results may not be perfect, please recheck</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            <li className="flex flex-row gap-2">
                                <h2 className="font-semibold">Prediction:</h2>
                                <p>{response.prediction}</p>
                            </li>
                            <li className="flex flex-row gap-2">
                                <h2 className="font-semibold">Confidence:</h2>
                                <p>{response.confidence}</p>
                            </li>
                            <li className="flex flex-row gap-2">
                                <h2 className="font-semibold">Probability:</h2>
                                <p>{response.probability}</p>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            )}
        </>
    )
}