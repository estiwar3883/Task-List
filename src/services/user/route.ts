
export const data = async () => {
    const response = await fetch("/api/Users");
    const json = await response.json();
    
    return json;
};