const Callback = () => {
    alert(`Calling me`)
    const urlFragment = new URL(window.location.toString()).hash;
    const params = new URLSearchParams(urlFragment.slice(1));
    return params.get('access_token');
}

export default Callback