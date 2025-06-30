"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";

export default function Profile() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const pathParts = window.location.pathname.split("/");
    const id = pathParts[pathParts.length - 1];
    console.log(id);
    if (!id) {
      console.warn("No id param found in URL");
      return;
    }

    const fetchProfile = async (id: string) => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", id);

        if (error) {
          console.error("Supabase error:", error);
          setProfile(null);
        } else {
          setProfile(data);
        }
      } catch (e) {
        console.error("Fetch error:", e);
      }
    };

    fetchProfile(id);
  }, []);

  return (
    <div className="p-10">
      <h2 className="text-xl font-bold">Profile (IDOR)</h2>
      <pre>{profile ? JSON.stringify(profile, null, 2) : "Loading..."}</pre>
    </div>
  );
}
