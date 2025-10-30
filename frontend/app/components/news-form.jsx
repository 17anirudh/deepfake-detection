"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { newsSchema } from "../api/submit"  
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { news } from "../api/submit"
import { useState } from "react"

export default function NewsForm() {
  const [response, setResponse] = useState(null);

  const form = useForm({
    resolver: zodResolver(newsSchema),
    defaultValues: { text: "" }, // ✅ match schema
  })

  async function onSubmit(values) {
    const result = await news(values) // ✅ ensure API expects `text`
    if (result.status === "error") {
      toast.error("Error please try again")
      return;
    }

    toast.success("Submitted")
    setResponse(result)
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="text" // ✅ match schema key
            render={({ field }) => (
              <FormItem>
                <FormLabel>News</FormLabel>
                <FormControl>
                  <Textarea placeholder="Meta Superintelligence Labs hires Alexandr Wang" {...field} />
                </FormControl>
                <FormDescription>
                  This News will be predicted.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={form.formState.isSubmitting}>
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
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Result</CardTitle>
            <CardDescription>Results may not be perfect, please recheck</CardDescription>
          </CardHeader>
          <CardContent>
            <ul>
              <li className="flex flex-row gap-2">
                <strong>Prediction:</strong> {response.classification}
              </li>
              <li className="flex flex-row gap-2">
                <strong>Reason:</strong> {response.reason}
              </li>
            </ul>
          </CardContent>
        </Card>
      )}
    </>
  );
}
