import { useState } from "react";
import { FaDownload, FaEdit, FaTrash, FaSearch, FaRedo, FaTimes } from "react-icons/fa";

interface DataRow {
  id: number;
  timestamp: string;
  location: string;
  pm25: number;
  pm10: number;
  quality: "Good" | "Moderate" | "Poor";
}

const sampleRows: DataRow[] = [
  {
    id: 1,
    timestamp: "2025-09-20 14:30",
    location: "Colombo Central",
    pm25: 25,
    pm10: 45,
    quality: "Good",
  },
  {
    id: 2,
    timestamp: "2025-09-20 14:15",
    location: "Kandy City",
    pm25: 18,
    pm10: 32,
    quality: "Good",
  },
  {
    id: 3,
    timestamp: "2025-09-20 14:00",
    location: "Galle Harbor",
    pm25: 35,
    pm10: 58,
    quality: "Moderate",
  },
  {
    id: 4,
    timestamp: "2025-09-20 13:45",
    location: "Negombo",
    pm25: 12,
    pm10: 28,
    quality: "Good",
  },
  {
    id: 5,
    timestamp: "2025-09-19 13:30",
    location: "Kaduwela",
    pm25: 38,
    pm10: 70,
    quality: "Poor",
  },
];

const allLocations = [
  "All Locations",
  "Colombo Central",
  "Kandy City",
  "Galle Harbor",
  "Negombo",
  "Kaduwela",
];

const allQuality = ["All Quality Levels", "Good", "Moderate", "Poor"];

const DataManagement = () => {
  const [rows, setRows] = useState<DataRow[]>(sampleRows);
  const [startDate, setStartDate] = useState("2025-09-19");
  const [endDate, setEndDate] = useState("2025-09-20");
  const [location, setLocation] = useState(allLocations[0]);
  const [quality, setQuality] = useState(allQuality[0]);

  // Modal states
  const [editingRow, setEditingRow] = useState<DataRow | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [editPm25, setEditPm25] = useState<number>(0);
  const [editPm10, setEditPm10] = useState<number>(0);

  //get date from timestamp
  const getDateFromTimestamp = (timestamp: string) => {
    return timestamp.split(' ')[0];
  };

  //filter logic
  const filtered = rows.filter((row) => {
    const rowDate = getDateFromTimestamp(row.timestamp);
    const dateInRange = rowDate >= startDate && rowDate <= endDate;
    const locationMatch = location === "All Locations" || row.location === location;
    const qualityMatch = quality === "All Quality Levels" || row.quality === quality;
    
    return dateInRange && locationMatch && qualityMatch;
  });

  const resetFilters = () => {
    setStartDate("2025-09-19");
    setEndDate("2025-09-20");
    setLocation(allLocations[0]);
    setQuality(allQuality[0]);
  };

  // Edit functionality
  const handleEdit = (row: DataRow) => {
    setEditingRow(row);
    setEditPm25(row.pm25);
    setEditPm10(row.pm10);
  };

  const saveEdit = () => {
    if (!editingRow) return;
    
    // Determine quality based on PM values
    let newQuality: "Good" | "Moderate" | "Poor" = "Good";
    if (editPm25 > 50 || editPm10 > 100) newQuality = "Poor";
    else if (editPm25 > 25 || editPm10 > 50) newQuality = "Moderate";

    setRows(rows.map(row => 
      row.id === editingRow.id 
        ? { ...row, pm25: editPm25, pm10: editPm10, quality: newQuality }
        : row
    ));
    setEditingRow(null);
  };

  const cancelEdit = () => {
    setEditingRow(null);
    setEditPm25(0);
    setEditPm10(0);
  };

  // Delete functionality
  const handleDelete = (id: number) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = () => {
    if (deleteConfirm === null) return;
    setRows(rows.filter(row => row.id !== deleteConfirm));
    setDeleteConfirm(null);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      {/* Filter Card */}
      <div className="p-4 md:p-6 bg-white/80 rounded-xl shadow animate-fade-in-up">
        <h3 className="text-lg font-bold text-emerald-900 mb-4">
          Search & Filter Data
        </h3>
        
        {/* Filter Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block font-medium text-sm mb-1" htmlFor="start-date">
              Date Range
            </label>
            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-lime-400"
            />
          </div>
          <div>
            <label className="block font-medium text-sm mb-1" htmlFor="end-date">
              End Date
            </label>
            <input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-lime-400"
            />
          </div>
          <div>
            <label className="block font-medium text-sm mb-1" htmlFor="loc">
              Sensor Location
            </label>
            <select
              id="loc"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border p-2 rounded bg-white focus:ring-2 focus:ring-lime-400"
            >
              {allLocations.map((loc) => (
                <option key={loc}>{loc}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium text-sm mb-1" htmlFor="qual">
              Data Quality
            </label>
            <select
              id="qual"
              value={quality}
              onChange={(e) =>
                setQuality(e.target.value as DataRow["quality"] | "All Quality Levels")
              }
              className="w-full border p-2 rounded bg-white focus:ring-2 focus:ring-lime-400"
            >
              {allQuality.map((q) => (
                <option key={q}>{q}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex items-center justify-center gap-2 bg-lime-500 hover:bg-lime-600 text-white py-2 px-4 rounded font-medium transition">
            <FaSearch className="w-4 h-4" />
            <span className="hidden sm:inline">Search Data</span>
          </button>
          <button
            className="flex items-center justify-center gap-2 bg-white border border-gray-400 hover:bg-gray-100 text-gray-700 py-2 px-4 rounded font-medium transition"
            onClick={resetFilters}
          >
            <FaRedo className="w-4 h-4" />
            <span className="hidden sm:inline">Reset Filters</span>
          </button>
          <button className="flex items-center justify-center gap-2 bg-white border border-gray-400 hover:bg-gray-100 text-gray-700 py-2 px-4 rounded font-medium transition">
            <FaDownload className="w-4 h-4" />
            <span className="hidden sm:inline">Export Filtered Data</span>
          </button>
        </div>
      </div>

      {/* Data Table - Mobile */}
      <div className="bg-white/80 rounded-xl shadow overflow-hidden">
        <div className="block lg:hidden">
          <div className="p-4 border-b bg-green-50">
            <h4 className="font-semibold text-emerald-900">
              Data Records ({filtered.length})
            </h4>
          </div>
          <div className="divide-y">
            {filtered.map((row, i) => (
              <div key={i} className="p-4 hover:bg-green-50">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm font-medium text-gray-900">
                    {row.location}
                  </div>
                  <div className="flex gap-1">
                    <button
                      className="p-2 bg-lime-500 hover:bg-lime-600 text-white rounded-full transition"
                      title="Edit"
                      onClick={() => handleEdit(row)}
                    >
                      <FaEdit className="w-3 h-3" />
                    </button>
                    <button
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition"
                      title="Delete"
                      onClick={() => handleDelete(row.id)}
                    >
                      <FaTrash className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mb-2">{row.timestamp}</div>
                <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                  <div>
                    <span className="text-gray-500">PM2.5:</span> {row.pm25} µg/m³
                  </div>
                  <div>
                    <span className="text-gray-500">PM10:</span> {row.pm10} µg/m³
                  </div>
                </div>
                <div>
                  {row.quality === "Good" && (
                    <span className="bg-lime-100 text-lime-600 px-2 py-1 rounded-full text-xs font-semibold">
                      Good
                    </span>
                  )}
                  {row.quality === "Moderate" && (
                    <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full text-xs font-semibold">
                      Moderate
                    </span>
                  )}
                  {row.quality === "Poor" && (
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-semibold">
                      Poor
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Table - Desktop */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-green-100 text-emerald-900">
                <th className="py-3 px-4 text-left font-semibold">Timestamp</th>
                <th className="py-3 px-4 text-left font-semibold">Location</th>
                <th className="py-3 px-4 text-left font-semibold">PM2.5</th>
                <th className="py-3 px-4 text-left font-semibold">PM10</th>
                <th className="py-3 px-4 text-left font-semibold">Quality</th>
                <th className="py-3 px-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((row, i) => (
                <tr key={i} className="hover:bg-green-50 transition-colors">
                  <td className="py-3 px-4 text-sm">{row.timestamp}</td>
                  <td className="py-3 px-4 font-medium">{row.location}</td>
                  <td className="py-3 px-4 text-sm">{row.pm25} µg/m³</td>
                  <td className="py-3 px-4 text-sm">{row.pm10} µg/m³</td>
                  <td className="py-3 px-4">
                    {row.quality === "Good" && (
                      <span className="bg-lime-100 text-lime-700 px-3 py-1 rounded-full text-xs font-semibold">
                        Good
                      </span>
                    )}
                    {row.quality === "Moderate" && (
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                        Moderate
                      </span>
                    )}
                    {row.quality === "Poor" && (
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                        Poor
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center gap-2">
                      <button
                        className="flex items-center gap-1 bg-lime-500 hover:bg-lime-600 text-white px-3 py-1 rounded transition"
                        title="Edit"
                        onClick={() => handleEdit(row)}
                      >
                        <FaEdit className="w-3 h-3" />
                        <span className="hidden xl:inline text-sm">Edit</span>
                      </button>
                      <button
                        className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                        title="Delete"
                        onClick={() => handleDelete(row.id)}
                      >
                        <FaTrash className="w-3 h-3" />
                        <span className="hidden xl:inline text-sm">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* No results msg */}
        {filtered.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <FaSearch className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p>No records found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingRow && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-emerald-900">
                Edit Record - {editingRow.location}
              </h3>
              <button
                onClick={cancelEdit}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <FaTimes className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PM2.5 (µg/m³)
                </label>
                <input
                  type="number"
                  value={editPm25}
                  onChange={(e) => setEditPm25(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-lime-400"
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PM10 (µg/m³)
                </label>
                <input
                  type="number"
                  value={editPm10}
                  onChange={(e) => setEditPm10(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-lime-400"
                  min="0"
                  step="1"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={saveEdit}
                className="flex-1 bg-lime-500 hover:bg-lime-600 text-white py-2 px-4 rounded-lg font-medium transition"
              >
                Save Changes
              </button>
              <button
                onClick={cancelEdit}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-medium transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation msg */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-red-900 mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this record? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-medium transition"
              >
                Delete
              </button>
              <button
                onClick={cancelDelete}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-medium transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default DataManagement;