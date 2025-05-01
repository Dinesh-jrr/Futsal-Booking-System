"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Image from "next/image";
import { Dialog } from "@headlessui/react";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/lib/uploadthing";
import { useSession } from "next-auth/react";

const availableTimeSlots = [
  "6 - 7 AM",
  "7 - 8 AM",
  "8 - 9 AM",
  "9 - 10 AM",
  "10 - 11 AM",
  "11 - 12 PM",
  "12 - 1 PM",
  "1 - 2 PM",
  "2 - 3 PM",
  "3 - 4 PM",
  "4 - 5 PM",
  "5 - 6 PM",
  "6 - 7 PM",
  "7 - 8 PM",
  "8 - 9 PM",
];

export default function CreateFutsalForm() {
  const router = useRouter();
  const { data: session } = useSession();

  const [form, setForm] = useState({
    futsalName: "",
    location: "",
    contactNumber: "",
    pricePerHour: "",
    address: "",
    description: "",
  });

  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [uploadedDocUrls, setUploadedDocUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSlot = (slot: string) => {
    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  const handleSubmit = async () => {
    if (uploadedImageUrls.length === 0) {
      toast.error("Please upload at least one image.");
      return;
    }

    if (selectedSlots.length === 0) {
      toast.error("Please select at least one available time slot.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...form,
        ownerId: session?.user?.id,
        availableTimeSlots: selectedSlots,
        images: uploadedImageUrls,
        documents: uploadedDocUrls,
      };

      const res = await fetch("http://localhost:5000/api/createfutsal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Submission failed.");
        return;
      }

      toast.success("Futsal submitted for review!");
      router.push("/futsalstatus");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
      setIsPreviewOpen(false);
    }
  };
  const handleRemoveImage = (indexToRemove: number) => {
    setUploadedImageUrls((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleRemoveDoc = (indexToRemove: number) => {
    setUploadedDocUrls((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };
  const handleSelectAllSlots = () => {
    if (selectedSlots.length === availableTimeSlots.length) {
      setSelectedSlots([]); // ✅ Deselect all
    } else {
      setSelectedSlots(availableTimeSlots); // ✅ Select all
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setIsPreviewOpen(true);
        }}
        className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-lg space-y-8 border border-green-500"
      >
        <Button
          variant="outline"
          onClick={() => router.push("/")}
          className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-green-500 hover:text-white"
        >
          Back
        </Button>

        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Futsal Registration Form
          </h1>
          <p className="text-gray-500 text-sm">
            Register your futsal to start receiving bookings. All fields are
            required.
          </p>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Input
            name="futsalName"
            placeholder="Futsal Name *"
            value={form.futsalName}
            onChange={handleChange}
            required
            className="bg-white border-2 border-green-500 text-black rounded-lg py-3 px-4"
          />
          <Input
            name="contactNumber"
            placeholder="Contact Number *"
            value={form.contactNumber}
            onChange={handleChange}
            required
            className="bg-white border-2 border-green-500 text-black rounded-lg py-3 px-4"
          />
          <Input
            name="location"
            placeholder="Location *"
            value={form.location}
            onChange={handleChange}
            required
            className="bg-white border-2 border-green-500 text-black rounded-lg py-3 px-4"
          />
          <Input
            name="pricePerHour"
            type="number"
            placeholder="Price per Hour (Rs) *"
            value={form.pricePerHour}
            onChange={handleChange}
            required
            className="bg-white border-2 border-green-500 text-black rounded-lg py-3 px-4"
          />
          <Textarea
            name="address"
            placeholder="Full Address *"
            value={form.address}
            onChange={handleChange}
            className="bg-white border-2 border-green-500 text-black rounded-lg px-4 py-2 md:col-span-2 h-12 resize-none"
            required
          />
          <Textarea
            name="description"
            placeholder="Describe your Futsal (facilities, environment, size, etc.) *"
            value={form.description}
            onChange={handleChange}
            className="bg-white border-2 border-green-500 text-black rounded-lg px-4 py-3 md:col-span-2 h-32 resize-none"
            required
          />
        </div>

        {/* Time Slots */}
<div>
  <label className="block mb-2 text-sm font-medium text-gray-700">
    Available Time Slots *
  </label>

  {/* ✅ Select All / Deselect All button */}
  <div className="flex items-center gap-3 mb-3">
    <button
      type="button"
      onClick={handleSelectAllSlots}
      className="text-sm text-green-600 hover:underline"
    >
      {selectedSlots.length === availableTimeSlots.length ? "Deselect All" : "Select All"}
    </button>
  </div>

  <div className="flex flex-wrap gap-3">
    {availableTimeSlots.map((slot, i) => (
      <button
        key={i}
        type="button"
        onClick={() => toggleSlot(slot)}
        className={`px-6 py-2 rounded-full text-sm border transition-all duration-300 ${
          selectedSlots.includes(slot)
            ? "bg-green-600 text-white border-green-600 shadow-md"
            : "bg-white text-gray-700 border-gray-300 hover:bg-green-100"
        }`}
      >
        {slot}
      </button>
    ))}
  </div>
</div>

        {/* Upload Images */}
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Upload Futsal Images
          </label>

          <div className="flex flex-col items-center justify-center bg-gray-100 p-4 border-2 border-dashed border-gray-400 rounded-lg w-full">
            {/* Upload Button */}
            {uploadedImageUrls.length < 5 && ( // ✅ Only show button if less than 5 images
              <UploadButton<OurFileRouter, keyof OurFileRouter>
                endpoint="futsalImageUploader"
                appearance={{
                  button: "bg-green-600 text-white",
                  allowedContent: "text-sm text-gray-500",
                  container: "border-green-500",
                }}
                onClientUploadComplete={(res) => {
                  const newUrls = res.map((file) => file.url);
                  setUploadedImageUrls((prev) => {
                    const combined = [...prev, ...newUrls];
                    return combined.slice(0, 5); // ✅ limit to 5 images max
                  });
                  toast.success("Images uploaded!");
                }}
                onUploadError={(error) => {
                  console.error("Image upload error:", error);
                  toast.error("Image upload failed.");
                }}
              />
            )}

            {/* Small info text */}
            <label
              htmlFor="upload-images"
              className="text-sm text-gray-500 mt-2 cursor-pointer"
            >
              {uploadedImageUrls.length}/5 images uploaded
            </label>

            {/* Uploaded Images Preview */}
            <div className="mt-4 flex flex-wrap gap-4 justify-center">
              {uploadedImageUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={url}
                    alt={`Uploaded image ${index + 1}`}
                    width={100}
                    height={100}
                    className="rounded-md border object-cover"
                  />

                  {/* ❌ Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition"
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upload Documents */}
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Upload Futsal Ownership Documents (Single PDF)
          </label>

          <div className="flex flex-col items-center justify-center bg-gray-100 p-4 border-2 border-dashed border-gray-400 rounded-lg w-full">
            {/* Upload Button */}
            {uploadedDocUrls.length < 1 && ( // ✅ Only allow 1 document
              <UploadButton<OurFileRouter, keyof OurFileRouter>
                endpoint="futsalDocumentUploader"
                appearance={{
                  button: "bg-green-600 text-white",
                  allowedContent: "text-sm text-gray-500",
                  container: "border-green-500",
                }}
                onClientUploadComplete={(res) => {
                  const newUrls = res.map((file) => file.url);
                  setUploadedDocUrls(newUrls.slice(0, 1)); // ✅ keep only 1 document
                  toast.success("Document uploaded!");
                }}
                onUploadError={(error) => {
                  console.error("Document upload error:", error);
                  toast.error("Document upload failed.");
                }}
              />
            )}

            {/* Info text */}
            <p className="text-sm text-gray-600 mt-2 text-center">
              Please upload a single PDF file containing all necessary documents
              (e.g., Ownership Proof, Registration, ID Proof).
            </p>

            {/* Uploaded Document Preview */}
            <div className="mt-4 flex flex-col gap-2 w-full">
              {uploadedDocUrls.map((docUrl, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white p-2 rounded border"
                >
                  <a
                    href={docUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline truncate max-w-[80%]"
                  >
                    View Uploaded Document
                  </a>
                  <button
                    type="button"
                    onClick={() => handleRemoveDoc(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <Button
            type="submit"
            className="px-8 py-3 text-white bg-green-600 hover:bg-green-700 rounded-lg"
          >
            Preview
          </Button>
        </div>
      </form>

      {/* Preview Dialog */}
      <Dialog
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 text-black"
      >
        <div className="bg-white max-w-lg w-full p-6 rounded-lg relative space-y-4 overflow-y-auto max-h-[90vh] text-black">
          <h2 className="text-xl font-bold text-center mb-4">
            Preview Futsal Info
          </h2>
          <p>
            <strong>Name:</strong> {form.futsalName}
          </p>
          <p>
            <strong>Location:</strong> {form.location}
          </p>
          <p>
            <strong>Address:</strong> {form.address}
          </p>
          <p>
            <strong>Contact:</strong> {form.contactNumber}
          </p>
          <p>
            <strong>Price:</strong> Rs. {form.pricePerHour}
          </p>
          <p>
            <strong>Description:</strong> {form.description}
          </p>
          <p>
            <strong>Slots:</strong> {selectedSlots.join(", ")}
          </p>

          <div>
            <p className="font-medium mb-2">Images:</p>
            <div className="flex flex-wrap gap-3">
              {uploadedImageUrls.map((url, index) => (
                <Image
                  key={index}
                  src={url}
                  alt={`Uploaded image ${index}`}
                  width={80}
                  height={80}
                  className="rounded border object-cover"
                />
              ))}
            </div>
          </div>

          <div>
            <p className="font-medium mt-4 mb-2">Documents:</p>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {uploadedDocUrls.map((doc, index) => (
                <li key={index}>
                  <a
                    href={doc}
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    {`Document ${index + 1}`}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Back
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
