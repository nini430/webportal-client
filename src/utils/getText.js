export const getText=html=>{
    const text=new DOMParser().parseFromString(html,"text/html");
    return text.body.textContent;
}