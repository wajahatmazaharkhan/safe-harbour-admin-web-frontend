import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useEffect, useMemo, useState } from "react";
import { getAllUsers } from "../services/user-service";
import useTitle from "../hooks/useTitle";
import { Eye, Pencil, Trash2, Plus, Download } from "lucide-react";
import { PageNavigatorStatus } from "../components";
import dayjs from "dayjs";

const Users = () => {
  let title = "User management";
  useTitle(title);

  const userTabs = ["User Role", "Username", "Activity Log"];
  const [current, setCurrent] = useState(userTabs[1]);

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);

  // NEW STATES (SAFE ADDITIONS)
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [page, pageSize]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      const apiUsers = res?.data?.data?.users ?? [];
      const pagination = res?.data?.data?.pagination;

      setUsers(apiUsers);
      setRowCount(pagination?.totalUsers ?? 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // SEARCH + FILTER
  const filteredUsers = useMemo(() => {
    return users?.filter((u) => {
      const matchesSearch =
        u?.fullname?.toLowerCase()?.includes(search.toLowerCase()) ||
        u?.email?.toLowerCase()?.includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || u?.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [users, search, statusFilter]);

  // COLUMNS PER TAB
  const columns = useMemo(() => {
    if (current === "User Role") {
      return [
        { field: "role", headerName: "Role", flex: 1 },
        { field: "fullname", headerName: "Full Name", flex: 1.5 },
      ];
    }

    if (current === "Activity Log") {
      return [
        { field: "fullname", headerName: "Full Name", flex: 1.5 },
        {
          field: "status",
          headerName: "Status",
          flex: 1,
          renderCell: (p) => (
            <span
              className={`capitalize font-medium ${
                p?.value === "active" ? "text-green-600" : "text-red-600"
              }`}
            >
              {p?.value ?? "-"}
            </span>
          ),
        },
        {
          field: "last_login",
          headerName: "Last Login",
          flex: 1.5,
          renderCell: (p) =>
            p?.value ? dayjs(p.value).format("DD MMM YYYY HH:mm") : "—",
        },
      ];
    }

    return [
      { field: "role", headerName: "Role", flex: 1 },
      { field: "fullname", headerName: "Full Name", flex: 1.5 },
      { field: "email", headerName: "Email", flex: 2 },
      { field: "phone_number", headerName: "Phone Number", flex: 1.3 },
      {
        field: "createdAt",
        headerName: "Date Created",
        flex: 1.5,
        renderCell: (p) =>
          p?.value ? dayjs(p.value).format("DD MMM YYYY HH:mm") : "—",
      },
      {
        field: "status",
        headerName: "Status",
        flex: 1,
        renderCell: (p) => (
          <span
            className={`capitalize font-medium ${
              p?.value === "active" ? "text-green-600" : "text-red-600"
            }`}
          >
            {p?.value ?? "-"}
          </span>
        ),
      },
      {
        field: "actions",
        headerName: "",
        width: 120,
        renderCell: (p) => (
          <div className="flex gap-3">
            <Eye
              className="h-4 w-4 cursor-pointer"
              onClick={() => setSelectedUser(p?.row)}
            />
            <Pencil className="h-4 w-4 cursor-pointer" />
            <Trash2 className="h-4 w-4 cursor-pointer" />
          </div>
        ),
      },
    ];
  }, [current]);

  const rows = filteredUsers?.map((u) => ({
    id: u?._id,
    ...u,
  }));

  // EXPORT
  const exportCSV = () => {
    const csv =
      "Name,Email,Role,Status\n" +
      filteredUsers
        ?.map((u) => `${u?.fullname},${u?.email},${u?.role},${u?.status}`)
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
  };

  return (
    <div className="p-5">
      <PageNavigatorStatus title={title} />

      {/* Tabs */}
      <div className="mt-6 flex gap-8 border-b">
        {userTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setCurrent(tab)}
            className={`pb-3 text-sm font-medium ${
              current === tab
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="mt-5 flex items-center justify-between">
        <div className="flex gap-3">
          <input
            placeholder="Search Username"
            className="border rounded px-3 py-2 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border rounded px-3 py-2 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 border px-3 py-2 rounded text-sm cursor-pointer"
          >
            <Download size={16} /> Export
          </button>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded text-sm cursor-pointer">
            <Plus size={16} /> Add User
          </button>
        </div>
      </div>

      {/* Table */}
      <Paper className="mt-6">
        <DataGrid
          autoHeight
          rows={rows}
          columns={columns}
          loading={loading}
          page={page}
          pageSize={pageSize}
          rowCount={rowCount}
          paginationMode="server"
          checkboxSelection
          onPageChange={(p) => setPage(p)}
          onPageSizeChange={(s) => setPageSize(s)}
        />
      </Paper>

      {/* MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-[500px]">
            <h2 className="font-semibold text-lg mb-4">User Details</h2>
            <div className="space-y-2 text-sm">
              <p>
                <b>Name:</b> {selectedUser?.fullname}
              </p>
              <p>
                <b>Email:</b> {selectedUser?.email}
              </p>
              <p>
                <b>Phone:</b> {selectedUser?.phone_number}
              </p>
              <p>
                <b>Role:</b> {selectedUser?.role}
              </p>
              <p>
                <b>Status:</b> {selectedUser?.status}
              </p>
              <p>
                <b>Verified:</b> {selectedUser?.isVerified ? "Yes" : "No"}
              </p>
            </div>
            <button
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => setSelectedUser(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
