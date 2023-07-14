const formService = () => {
    const form = document.forms["newsControls"];
    const country = form.elements["country"];
    const search = form.elements["search"];

    return {
        form,
        country,
        search
    };
}

export default formService;