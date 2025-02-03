export default function Loading({ loading }) {
    if(!loading) return('');

    return (
        <div className="loader-background">
            <div className="loader"></div>
        </div>
    );
}