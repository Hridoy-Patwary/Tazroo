class InputServices {
    varifyInputs = (inputList) => {
        let varified = true, values = {
            datetime: Date.now()
        };
        inputList.forEach((inp) => {
            if(inp.value === ''){
                varified = false;
                inp.style.borderColor = 'var(--warning)';
            }else {
                if(inp.type === 'email'){
                    const emailVrfy = String(inp.value).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
                    if(emailVrfy === null){
                        varified = false;
                        inp.style.borderColor = 'var(--warning)';
                    }else{
                        inp.style = '';
                        values[inp.name] = inp.value;
                    }
                }else{
                    inp.style = '';
                    values[inp.name] = inp.value;
                }
            };
        });
        return {
            varified: varified,
            values: values
        };
    }

    emailVarifier = (email) => {
        return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    }

    clearInputs = (inputList) => {
        inputList.forEach((inp) => {
            if(inp.type === 'checkbox'){
                inp.checked = false;
            }else inp.value = '';
        })
    }
}

const inpServices = new InputServices();

export default inpServices;