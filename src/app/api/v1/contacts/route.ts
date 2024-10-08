import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { z } from "zod";

// Define the Zod schema for the request body
const ContactSchema = z.object({
  first_name: z.string().min(1).max(255).optional(),
  last_name: z.string().min(1).max(255).optional(),
  email: z.string().email(),
  list_ids: z.array(z.string().uuid()).optional(),
});

type Contact = z.infer<typeof ContactSchema> & { id: string };

export async function POST(request: Request) {
  const apiKey = request.headers.get("x-api-key");

  if (!apiKey) {
    return NextResponse.json({ error: "API key is required" }, { status: 401 });
  }

  try {
    const supabase = createClient();
    const { data: accountId, error: authError } = await supabase.rpc("authenticate_api_key", { api_key: apiKey });

    if (authError) {
      console.error("API key authentication error:", authError);
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    if (!accountId) {
      console.error("No account ID returned for API key");
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    // Parse and validate the request body
    const body = await request.json();
    const validationResult = ContactSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ error: "Invalid request body", details: validationResult.error.issues }, { status: 400 });
    }

    const { first_name, last_name, email, list_ids } = validationResult.data;

    // Try to insert the contact
    const { data: contactData, error: insertError } = await supabase
      .from("contacts")
      .insert({
        account_id: accountId,
        first_name,
        last_name,
        email,
        source: "api"
      })
      .select()
      .single()
      .setHeader("x-api-key", apiKey);

    let contact: Contact | null = null;

    if (insertError) {
      // Check if the error is due to a unique constraint violation (contact already exists)
      if (insertError.code === '23505') {

        console.log("Contact already exists");
        // Fetch the existing contact
        const { data: existingContact, error: fetchError } = await supabase
          .from("contacts")
          .select()
          .eq("account_id", accountId)
          .eq("email", email)
          .single()
          .setHeader("x-api-key", apiKey);

        if (fetchError) {
          throw fetchError;
        }

        contact = existingContact;
      } else {
        throw insertError;
      }
    } else {
      contact = contactData;
    }

    // Add contact to lists if list_ids are provided
    if (list_ids && list_ids.length > 0 && contact) {
      const listContacts = list_ids.map(list_id => ({
        list_id,
        contact_id: contact.id
      }));


      const { error: listError } = await supabase
        .from("list_contacts")
        .insert(listContacts)
        .setHeader("x-api-key", apiKey)

      if (listError) {
        console.error("Error adding contact to lists:", listError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing contact:", error);
    return NextResponse.json({ error: "An error occurred while processing the contact" }, { status: 500 });
  }
}
