export const showToast =(message: string, type:"success"|"error") =>{

const toastContainer = document.getElementById("toast-container")!;
const toast = document.createElement("div");
toast.classList.add("toast", type === "success" ? "toast-success" : "toast-error");
toast.textContent = message;

toastContainer.appendChild(toast);
setTimeout(() => 
{
    toast.remove();
}, 4000)
};