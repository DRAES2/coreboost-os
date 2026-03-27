"use client";

import { useState, useEffect } from "react";

type Client = {
  name: string;
  service: string;
  phone: string;
  status: string;
  notes: string;
};

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);

  // 🔥 LOAD CLIENTS ON PAGE LOAD
  useEffect(() => {
    const saved = localStorage.getItem("coreboost_clients");
    if (saved) {
      setClients(JSON.parse(saved));
    }
  }, []);

  // 🔥 SAVE CLIENTS WHEN THEY CHANGE
  useEffect(() => {
    localStorage.setItem("coreboost_clients", JSON.stringify(clients));
  }, [clients]);

  const updateClient = (index: number, field: keyof Client, value: string) => {
    const updated = [...clients];
    updated[index][field] = value;
    setClients(updated);
  };

  const addClient = () => {
    setClients([
      ...clients,
      { name: "", service: "", phone: "", status: "New", notes: "" },
    ]);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      <h1 className="text-3xl font-bold">Client Tracker</h1>

      <button
        onClick={addClient}
        className="bg-yellow-500 text-black px-4 py-2 rounded font-semibold"
      >
        + Add Client
      </button>

      <div className="overflow-x-auto">
        <table className="w-full border border-zinc-800 rounded-xl overflow-hidden">

          <thead className="bg-zinc-900">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Service</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Notes</th>
            </tr>
          </thead>

          <tbody>
            {clients.map((client, i) => (
              <tr key={i} className="border-t border-zinc-800">

                <td className="p-2">
                  <input
                    value={client.name}
                    onChange={(e) =>
                      updateClient(i, "name", e.target.value)
                    }
                    className="w-full bg-black text-white placeholder-zinc-500 border border-zinc-700 p-2 rounded"
                  />
                </td>

                <td className="p-2">
                  <input
                    value={client.service}
                    onChange={(e) =>
                      updateClient(i, "service", e.target.value)
                    }
                    className="w-full bg-black text-white placeholder-zinc-500 border border-zinc-700 p-2 rounded"
                  />
                </td>

                <td className="p-2">
                  <input
                    value={client.phone}
                    onChange={(e) =>
                      updateClient(i, "phone", e.target.value)
                    }
                    className="w-full bg-black text-white placeholder-zinc-500 border border-zinc-700 p-2 rounded"
                  />
                </td>

                <td className="p-2">
                  <select
                    value={client.status}
                    onChange={(e) =>
                      updateClient(i, "status", e.target.value)
                    }
                    className="w-full bg-black text-white border border-zinc-700 p-2 rounded"
                  >
                    <option>New</option>
                    <option>In Progress</option>
                    <option>Optimized</option>
                    <option>Follow-Up</option>
                  </select>
                </td>

                <td className="p-2">
                  <input
                    value={client.notes}
                    onChange={(e) =>
                      updateClient(i, "notes", e.target.value)
                    }
                    className="w-full bg-black text-white placeholder-zinc-500 border border-zinc-700 p-2 rounded"
                  />
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}