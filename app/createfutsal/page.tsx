"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Image from "next/image";
import { Dialog } from "@headlessui/react";
import { UploadButton } from "@uploadthing/react"; // Correct import for UploadButton
import type { OurFileRouter } from "@/lib/uploadthing"; // Import the file router

const availableTimeSlots = [
  "6AM - 8AM",
  "8AM - 10AM",
  "10AM - 12PM",
  "12PM - 2PM",
  "2PM - 4PM",
  "4PM - 6PM",
  "6PM - 8PM",
];

export default function CreateFutsalForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    futsalName: "",
    location: "",
    contactNumber: "",
    pricePerHour: "",
    address: "",
  });

  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [uploadedDocUrls, setUploadedDocUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        availableTimeSlots: selectedSlots,
        images: uploadedImageUrls,
        documents: uploadedDocUrls,
      };

      const res = await fetch("http://localhost:5000/api/futsals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Submission failed.");
        return;
      }

      toast.success("Futsal submitted for review!");
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
      setIsPreviewOpen(false);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Futsal Registration Form</h1>
          <p className="text-gray-500 text-sm">
            Register your futsal to start receiving bookings. All fields are required.
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
            className="bg-white border-2 border-green-500 text-black rounded-lg py-3 px-4 md:col-span-2"
            required
          />
        </div>

        {/* Time Slots */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Available Time Slots *</label>
          <div className="flex flex-wrap gap-3">
            {availableTimeSlots.map((slot, i) => (
              <button
                key={i}
                type="button"
                onClick={() => toggleSlot(slot)}
                className={`px-6 py-2 rounded-full text-sm ${
                  selectedSlots.includes(slot)
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-700 border-gray-300"
                } hover:shadow-md border border-gray-300`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Upload Images */}
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">Upload Futsal Images</label>
          <div className="flex flex-col items-center justify-center bg-gray-100 p-4 border-2 border-dashed border-gray-400 rounded-lg">
            {/* File Input to trigger the dialog */}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = e.target.files;
                if (!files) return;
                const fileUrls = Array.from(files).map(file => URL.createObjectURL(file));
                setUploadedImageUrls(fileUrls);
                toast.success("Images selected!");
              }}
              className="hidden"
              id="upload-images"
            />
            <label
              htmlFor="upload-images"
              className="text-sm text-gray-500 cursor-pointer"
            >
              Drag & Drop or Click to Browse
            </label>
          </div>
        </div>

        {/* Upload Documents */}
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">Upload Documents</label>
          <div className="flex flex-col items-center justify-center bg-gray-100 p-4 border-2 border-dashed border-gray-400 rounded-lg">
            {/* File Input to trigger the dialog */}
            <input
              type="file"
              accept="application/pdf"
              multiple
              onChange={(e) => {
                const files = e.target.files;
                if (!files) return;
                const fileUrls = Array.from(files).map(file => URL.createObjectURL(file));
                setUploadedDocUrls(fileUrls);
                toast.success("Documents selected!");
              }}
              className="hidden"
              id="upload-documents"
            />
            <label
              htmlFor="upload-documents"
              className="text-sm text-gray-500 cursor-pointer"
            >
              Drag & Drop or Click to Browse
            </label>
          </div>
        </div>

        {/* Submit button */}
        <div className="text-center">
          <Button type="submit" className="px-8 py-3 text-white bg-green-600 hover:bg-green-700 rounded-lg">
            Preview
          </Button>
        </div>
      </form>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white max-w-lg w-full p-6 rounded-lg relative space-y-4 overflow-y-auto max-h-[90vh]">
          <h2 className="text-xl font-bold text-center mb-4">Preview Futsal Info</h2>
          <p><strong>Name:</strong> {form.futsalName}</p>
          <p><strong>Location:</strong> {form.location}</p>
          <p><strong>Address:</strong> {form.address}</p>
          <p><strong>Contact:</strong> {form.contactNumber}</p>
          <p><strong>Price:</strong> Rs. {form.pricePerHour}</p>
          <p><strong>Slots:</strong> {selectedSlots.join(", ")}</p>

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
                  <a href={doc} target="_blank" className="text-blue-600 underline">
                    {`Document ${index + 1}`}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>Back</Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
