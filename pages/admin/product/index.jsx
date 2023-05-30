import Card from "@/components/card";
import TableHeader from "@/components/table/TableHeader";
import TableHeaderData from "@/components/table/TableHeaderData";
import TableLayout from "@/components/table/TableLayout";
import TableRow from "@/components/table/TableRow";
import TableRowData from "@/components/table/TableRowData";
import { useState } from "react";
import { MdAddBox } from "react-icons/md";

export default function Index() {
  return (
    <>
      <Card extra={"items-center w-full h-[82vh] p-[16px] bg-cover"}>
        <div className="w-full">
            <div className="mb-2 flex items-center justify-between">
              <div className="font-bold text-xl text-gray-800">Products</div>
              <div>
                <button onClick={() => setIsCreateProductModalOpen(true)}>
                  <MdAddBox className="h-8 w-8 text-blue-500 hover:text-blue-600"/>
                </button>
              </div>
            </div>
            <TableLayout 
              tableHeader={(
                <TableHeader>
                  <TableHeaderData>ID</TableHeaderData>
                  <TableHeaderData>Name</TableHeaderData>
                  <TableHeaderData>Price</TableHeaderData>
                </TableHeader>
              )}
              tableBody={(
                <>
                  <TableRow>
                    <TableRowData>1</TableRowData>
                    <TableRowData>Annie</TableRowData>
                    <TableRowData>$5000</TableRowData>
                  </TableRow>
                  <TableRow>
                    <TableRowData>2</TableRowData>
                    <TableRowData>Jannie</TableRowData>
                    <TableRowData>$5000</TableRowData>
                  </TableRow>
                  <TableRow>
                    <TableRowData>3</TableRowData>
                    <TableRowData>Frenkie</TableRowData>
                    <TableRowData>$5000</TableRowData>
                  </TableRow>
                </>
              )}
            />
          </div>
      </Card>
    </>
  )
}