export default function Search({onFiltersChange}) {
    return (
        <form onSubmit={onFiltersChange} className="search">
            <i className="fa-solid fa-search"></i>
            <input type="text" id="search-input" defaultValue=""/>
            <button type="submit">Search</button>
        </form>
    );
}