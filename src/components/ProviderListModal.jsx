import React from "react";
import { Search, SlidersHorizontal, List } from "lucide-react";

const ProviderListModal = ({
  title,
  roleLabel,
  providers,
  isLoading,
  error,
  onClose,
  onBack,
  onViewProfile,
}) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-gray-100 w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl p-4 sm:p-6 relative shadow-xl">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-500">
            Available {roleLabel} for consultation
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex items-center bg-gray-200 rounded-lg px-3 py-2 flex-1">
            <Search className="text-gray-500 w-4 h-4 mr-2" />
            <input
              type="text"
              placeholder="search..."
              className="bg-transparent outline-none w-full text-sm"
              disabled
            />
          </div>

          <button
            className="flex items-center justify-center gap-2 bg-gray-200 px-4 py-2 rounded-lg text-sm text-gray-700"
            disabled
          >
            <SlidersHorizontal size={16} />
            All Filters
          </button>

          <button
            className="flex items-center justify-center gap-2 bg-gray-200 px-4 py-2 rounded-lg text-sm text-gray-700"
            disabled
          >
            <List size={16} />
            Sort by
          </button>
        </div>

        {isLoading && (
          <div className="py-10 text-center text-sm text-gray-500">Loading providers...</div>
        )}

        {!isLoading && error && (
          <div className="py-10 text-center text-sm text-red-500">{error}</div>
        )}

        {!isLoading && !error && providers.length === 0 && (
          <div className="py-10 text-center text-sm text-gray-500">
            No users found for this category.
          </div>
        )}

        {!isLoading && !error && providers.length > 0 && (
          <div className="space-y-4">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className="bg-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <img
                    src={provider.image || "https://via.placeholder.com/120x120?text=Profile"}
                    alt={provider.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium text-gray-800">{provider.name}</h3>
                      <span className="text-green-500 text-xs flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Online
                      </span>
                    </div>

                    <p className="text-xs text-gray-600">
                      {provider.specialization} • {provider.experience || 0} Years Exp.
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 mt-1">
                      <span>⭐ {provider.rating || 4.7} ({provider.reviews || 0} reviews)</span>
                      <span>📍 {provider.location || "Pakistan"}</span>
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <p className="font-semibold text-gray-800">Rs. {provider.consultationFee || 0}</p>
                  <p className="text-xs text-gray-500 mb-2">Consultation fee</p>

                  <button
                    className="bg-red-500 hover:bg-red-600 text-white text-xs px-4 py-1.5 rounded-md"
                    onClick={() => onViewProfile(provider)}
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-between gap-3">
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-sm text-gray-800"
          >
            Back
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-black text-sm text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProviderListModal;
