export default function Filters({categories, onFiltersChange}) {
    return (
        <div>
            <p>Categories</p>
            <select onChange={onFiltersChange}>
                <option>All</option>
                {categories && categories.map(c => {
                    return <option value={c.category_id} key={c.category_id}>{c.name}</option>
                })}
            </select>
        </div>
    );
}