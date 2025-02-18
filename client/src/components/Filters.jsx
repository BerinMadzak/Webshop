export default function Filters({categories, onFiltersChange}) {
    return (
        <div className="category-filter">
            <p>Category</p>
            <select onChange={onFiltersChange} id="category-select">
                <option>All</option>
                {categories && categories.map(c => {
                    return <option value={c.category_id} key={c.category_id}>{c.name}</option>
                })}
            </select>
        </div>
    );
}