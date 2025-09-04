
const FilterControls = ({
  entriesPerPage,
  setEntriesPerPage, 
  searchTerm,
  setSearchTerm,
}) => (
  <div className="flex items-center justify-between mb-3">
    <select
      value={entriesPerPage}
      onChange={(e) => {

        setEntriesPerPage(Number(e.target.value)); 
        
      }}
      className="border border-gray-300 rounded px-2 py-1 text-sm"
    >
      <option value={5}>5</option>
      <option value={10}>10</option>
      <option value={20}>20</option>
      <option value={30}>30</option>
      <option value={50}>50</option>
      <option value={100}>100</option>
    </select>
    
    <input
      type="text"
      placeholder="Search..."
      className="border border-gray-300 px-2 py-2 text-sm rounded w-1/4"
      value={searchTerm}
      onChange={(e) => {
        setSearchTerm(e.target.value);
      }}
    />
  </div>
);

export default FilterControls;