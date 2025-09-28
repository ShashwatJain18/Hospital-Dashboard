import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, face } = req.body;
    const { data, error } = await supabase.from("patients").insert([
      {
        name,
        face_embedding: face.descriptor, // store array in Postgres
      },
    ]);

    if (error) return res.status(500).json({ error });
    res.status(200).json({ data });
  }
}
