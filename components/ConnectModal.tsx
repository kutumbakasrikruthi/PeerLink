"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  peer: { name: string };
  onSubmit: (data: {
    message: string;
    date: string;
    mode: "virtual" | "in-person";
  }) => void;
}

export default function ConnectModal({
  isOpen,
  onClose,
  peer,
  onSubmit,
}: ConnectModalProps) {
  const [message, setMessage] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [mode, setMode] = useState<"virtual" | "in-person">("virtual");

  const resetFields = () => {
    setMessage("");
    setDate("");
    setTime("");
    setMode("virtual");
  };

  const handleSubmit = () => {
    if (!message || !date || !time) {
      alert("Please fill all the fields.");
      return;
    }

    const fullDateTime = new Date(`${date}T${time}`);
    onSubmit({ message, date: fullDateTime.toISOString(), mode });
    resetFields();
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-30" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 shadow-xl transition-all">
                <Dialog.Title className="text-lg font-semibold text-gray-900 mb-4">
                  Request Session with {peer?.name}
                </Dialog.Title>

                <div className="space-y-4">
                  <textarea
                    className="w-full border text-gray-900 border-gray-300 rounded-md p-2"
                    placeholder="Write a short message..."
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />

                  <div className="flex gap-4">
                    <input
                      type="date"
                      className="w-1/2 border text-gray-900 border-gray-300 rounded-md p-2"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                    <input
                      type="time"
                      className="w-1/2 border text-gray-900 border-gray-300 rounded-md p-2"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700 mb-1">
                      Session Mode:
                    </label>
                    <select
                      className="w-full border text-gray-900 border-gray-300 rounded-md p-2"
                      value={mode}
                      onChange={(e) =>
                        setMode(e.target.value as "virtual" | "in-person")
                      }
                    >
                      <option value="virtual">Virtual</option>
                      <option value="in-person">In-person</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 text-gray-700 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Send Request
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
