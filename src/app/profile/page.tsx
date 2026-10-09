"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";

const ProfilePage = () => {
const router = useRouter();
const { data: session, isPending } = authClient.useSession();

const [name, setName] = useState("");
const [loading, setLoading] = useState(false);
const [signingOut, setSigningOut] = useState(false);

useEffect(() => {
if (!isPending && !session?.user) {
router.replace("/signin");
}
}, [isPending, session, router]);

useEffect(() => {
if (session?.user) {
setName(session.user.name ?? "");
}
}, [session?.user?.name]);

const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
event.preventDefault();

const trimmedName = name.trim();

if (!trimmedName) {
  toast.error("নাম খালি রাখা যাবে না");
  return;
}

setLoading(true);

try {
  const { error } = await authClient.updateUser({
    name: trimmedName,
  });

  if (error) {
    toast.error(error.message || "নাম আপডেট করা যায়নি");
    return;
  }

  toast.success("নাম সফলভাবে আপডেট হয়েছে");
  router.refresh();
} catch {
  toast.error("নাম আপডেট করার সময় সমস্যা হয়েছে");
} finally {
  setLoading(false);
}


};

const handleSignOut = async () => {
setSigningOut(true);


try {
  const { error } = await authClient.signOut();

  if (error) {
    toast.error(error.message || "সাইন আউট করা যায়নি");
    return;
  }

  toast.success("সফলভাবে সাইন আউট হয়েছে");
  router.replace("/");
  router.refresh();
} catch {
  toast.error("সাইন আউট করার সময় সমস্যা হয়েছে");
} finally {
  setSigningOut(false);
}

};

if (isPending || !session?.user) {
return ( <main className="min-h-[calc(100vh-150px)] bg-[#f3f7f3] px-4 py-10"> <div className="mx-auto max-w-2xl"> <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"> <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-gray-200" /> <div className="mx-auto mb-2 h-6 w-40 rounded bg-gray-200" /> <div className="mx-auto mb-8 h-4 w-56 rounded bg-gray-200" /> <div className="mb-4 h-10 rounded-lg bg-gray-200" /> <div className="h-10 rounded-lg bg-gray-200" /> </div> </div> </main>
);
}

const user = session.user;

return ( <main className="min-h-[calc(100vh-150px)] bg-[#f3f7f3] px-4 py-10"> <div className="mx-auto max-w-2xl"> <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"> <div className="mb-8 text-center">
{user.image ? (
<Image
src={user.image}
alt={user.name || "প্রোফাইল"}
width={80}
height={80}
unoptimized
className="mx-auto mb-4 h-20 w-20 rounded-full object-cover"
/>
) : ( <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-600 text-2xl font-bold text-white">
{user.name?.charAt(0).toUpperCase() || "U"} </div>
)}


        <h1 className="text-2xl font-bold text-gray-900">
          প্রোফাইল আপডেট
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          আপনার অ্যাকাউন্টের তথ্য পরিবর্তন করুন
        </p>
      </div>

      <div className="mb-6 rounded-xl bg-gray-50 p-4">
        <p className="text-xs font-medium text-gray-500">ইমেইল</p>
        <p className="mt-1 break-all text-sm font-medium text-gray-800">
          {user.email}
        </p>
      </div>

      <form onSubmit={handleUpdate} className="space-y-5">
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            নাম
          </label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="আপনার নাম"
            disabled={loading || signingOut}
            autoComplete="name"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-gray-100"
          />
        </div>

        <button
          type="submit"
          disabled={loading || signingOut}
          className="w-full rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "আপডেট হচ্ছে..." : "নাম আপডেট করুন"}
        </button>
      </form>

      <div className="my-7 h-px bg-gray-200" />

      <button
        type="button"
        onClick={handleSignOut}
        disabled={signingOut || loading}
        className="w-full rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {signingOut ? "সাইন আউট হচ্ছে..." : "সাইন আউট"}
      </button>
    </div>
  </div>
</main>


);
};

export default ProfilePage;
