"use client";
import React, { useState } from "react";
import {
  FileText,
  Trash2,
  Eye,
  RotateCcw,
  MoreVertical,
} from "lucide-react";

const SummariesPage = () => {
  const [activeTab, setActiveTab] = useState("summaries");

  const summariesData = {
    summaries: [
      {
        id: "SUM-001",
        topic: "UI/UX Design Review",
        host: "Talha Ahmed",
        date: "Mar 10, 2026",
      },
      {
        id: "SUM-002",
        topic: "Client Meeting Discussion",
        host: "Ali Khan",
        date: "Mar 12, 2026",
      },
    ],
    trash: [
      {
        id: "SUM-003",
        topic: "Old Project Sync",
        host: "Sara Ahmed",
        date: "Mar 01, 2026",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#EAEAF4] text-white p-6">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">Summaries</h1>
        <p className="text-[#E9164B] text-sm">
          Manage your meeting summaries
        </p>
      </div>

      {/* Tabs */}
      {/* <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveTab("summaries")}
          className={`px-4 py-2 rounded-lg text-sm ${
            activeTab === "summaries"
              ? "bg-[#E9164B]"
              : "bg-white/5 hover:bg-[#E51A54] border border-[#E51A54] text-[#E51A54] cursor-pointer hover:text-white"
          }`}
        >
          My Summaries
        </button>

        <button
          onClick={() => setActiveTab("trash")}
          className={`px-4 py-2 rounded-lg text-sm ${
           activeTab === "summaries"
              ? "bg-[#E9164B]"
              : "bg-white/5 hover:bg-[#E51A54] border border-[#E51A54] text-[#E51A54] cursor-pointer hover:text-white"
          }`}
        >
          Trash
        </button>
      </div> */}

       <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("summaries")}
            className={`px-4 py-2 rounded-lg text-sm ${
               activeTab === "summaries"
                ? "bg-[#E9164B]"
                : "bg-white/5 border border-[#E51A54] text-[#E51A54] cursor-pointer hover:bg-[#E51A54] hover:text-white"
            }`}
          >
             My Summaries
          </button>
          <button
           onClick={() => setActiveTab("trash")}
            className={`px-4 py-2 rounded-lg text-sm ${
               activeTab === "trash"
                ? "bg-[#E9164B]"
                : "bg-white/5 border border-[#E51A54] text-[#E51A54] cursor-pointer hover:bg-[#E51A54] hover:text-white"
            }`}
          >
              Trash
          </button>
        </div>

      {/* Table Container */}
      <div className="bg-white mt-4 border border-white/10 rounded-2xl overflow-hidden">
        
        {/* Table Header */}
        <div className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-white/10 text-sm text-gray-800 uppercase">
          <span>Topic</span>
          <span>ID</span>
          <span>Host</span>
          <span>Date Created</span>
          <span className="text-right">Actions</span>
        </div>

        {/* Table Body */}
        {summariesData[activeTab].length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto mb-4 text-gray-400" size={40} />
            <p className="text-gray-500">No summaries found</p>
          </div>
        ) : (
          summariesData[activeTab].map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-white/5 items-center transition"
            >
              {/* Topic */}
              <span className="font-medium text-gray-600">{item.topic}</span>

              {/* ID */}
              <span className="text-sm text-gray-500">{item.id}</span>

              {/* Host */}
              <span className="text-sm text-gray-600">{item.host}</span>

              {/* Date */}
              <span className="text-sm text-gray-500">
                {item.date}
              </span>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                
                {/* View */}
                <button className="p-2 text-gray-600 hover:bg-white/10 rounded-lg">
                  <Eye className="w-4 h-4" />
                </button>

                {/* Conditional Actions */}
                {activeTab === "summaries" ? (
                  <button className="p-2 text-gray-600 hover:bg-white/10 rounded-lg">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                ) : (
                  <button className="p-2 text-gray-600 hover:bg-white/10 rounded-lg">
                    <RotateCcw className="w-4 h-4 text-green-400" />
                  </button>
                )}

                <button className="p-2 text-gray-600 hover:bg-white/10 rounded-lg">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SummariesPage;