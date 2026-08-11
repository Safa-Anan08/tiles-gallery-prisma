"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api-client";
import Loader from "@/components/Loader";
import { toast } from "sonner";
import { Search, ShieldCheck, User as UserIcon, AlertCircle } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchUsers = async () => {
      try {
        const res = await apiClient.get("/users");
        if (isMounted) {
          if (res.success && Array.isArray(res.data)) {
            setUsers(res.data);
            setError(null);
          } else if (res.data && Array.isArray(res.data.users)) {
            setUsers(res.data.users);
            setError(null);
          } else {
            setUsers([]);
            const errMsg = res.message || "Failed to load users list";
            setError(errMsg);
            toast.error(errMsg);
          }
        }
      } catch (err) {
        if (isMounted) {
          const errMsg = "An error occurred while fetching users";
          setError(errMsg);
          toast.error(errMsg);
          setUsers([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUsers();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredUsers = users.filter((u) =>
    (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.role || "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader />;


  return (
    <div className="w-full max-w-7xl mx-auto space-y-5 sm:space-y-6 px-3 sm:px-4 lg:px-0">


      <div className="bg-white border border-slate-200 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              User Account Management
            </h1>

            <p className="text-[10px] sm:text-xs text-slate-500 mt-1 leading-relaxed">
              Registered accounts and role authorizations in PostgreSQL database
              <span className="font-bold text-slate-700">
                {" "}({users.length} Total Users)
              </span>
            </p>
          </div>


          <div className="relative w-full lg:w-72">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={17}
            />

            <input
              type="text"
              placeholder="Search name, email, or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-slate-900 focus:bg-white transition"
            />
          </div>

        </div>
      </div>



      {error && (
        <div className="flex items-start gap-3 p-3.5 sm:p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-bold">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}



      <div className="hidden md:block bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">

            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-6">User</th>
                <th className="py-4 px-6">Email</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Registered Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-sm">

              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-12 text-slate-400 font-medium"
                  >
                    {search
                      ? "No registered users match your search query."
                      : "No registered user accounts found in database."
                    }
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-slate-50/80 transition"
                  >


                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">

                        <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold shrink-0 overflow-hidden">
                          {u.image ? (
                            <img
                              src={u.image}
                              alt={u.name || "User"}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <UserIcon size={18} />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="font-bold text-slate-900">
                            {u.name || "Anonymous User"}
                          </div>

                          <div className="text-xs text-slate-400 font-mono truncate max-w-[180px]">
                            {u.id}
                          </div>
                        </div>

                      </div>
                    </td>

                    <td className="py-4 px-6 text-slate-700 font-medium">
                      {u.email}
                    </td>

                    <td className="py-4 px-6">
                      {u.role === "ADMIN" ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-extrabold text-rose-800 bg-rose-100 rounded-full border border-rose-200">
                          <ShieldCheck size={13} />
                          ADMIN
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-1 text-xs font-bold text-slate-700 bg-slate-100 rounded-full border border-slate-200">
                          USER
                        </span>
                      )}
                    </td>


                    <td className="py-4 px-6 text-slate-500 text-xs font-medium">
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>

                  </tr>
                ))
              )}

            </tbody>
          </table>
        </div>
      </div>



      <div className="md:hidden space-y-3">

        {filteredUsers.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
            <div className="h-12 w-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
              <UserIcon size={20} />
            </div>

            <p className="text-xs font-semibold text-slate-500">
              {search
                ? "No registered users match your search query."
                : "No registered user accounts found in database."
              }
            </p>
          </div>
        ) : (
          filteredUsers.map((u) => (
            <div
              key={u.id}
              className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm"
            >


              <div className="flex items-center gap-3">

                <div className="h-11 w-11 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold shrink-0 overflow-hidden">
                  {u.image ? (
                    <img
                      src={u.image}
                      alt={u.name || "User"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserIcon size={19} />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-slate-900 truncate">
                    {u.name || "Anonymous User"}
                  </h3>

                  <p className="text-[10px] text-slate-500 truncate mt-0.5">
                    {u.email}
                  </p>
                </div>


                {u.role === "ADMIN" ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-[9px] font-extrabold text-rose-800 bg-rose-100 rounded-full border border-rose-200 shrink-0">
                    <ShieldCheck size={11} />
                    ADMIN
                  </span>
                ) : (
                  <span className="px-2.5 py-1 text-[9px] font-bold text-slate-700 bg-slate-100 rounded-full border border-slate-200 shrink-0">
                    USER
                  </span>
                )}

              </div>



              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5">

                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                    User ID
                  </span>

                  <span className="text-[9px] text-slate-500 font-mono truncate max-w-[190px]">
                    {u.id}
                  </span>
                </div>


                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                    Registered
                  </span>

                  <span className="text-[10px] text-slate-600 font-medium">
                    {u.createdAt
                      ? new Date(u.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>

              </div>

            </div>
          ))
        )}

      </div>

    </div>
  );


}
