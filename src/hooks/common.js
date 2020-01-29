import {useHistory} from "react-router-dom"
import {SMNotification} from "../view/components";
import {useEffect, useState} from "react";


export const useNavigation = () => {

    const history = useHistory();

    return (path, {error, success}) => {
        if (error) {
            SMNotification("error", {message: error})
        } else if (success) {
            SMNotification("success", {message: success})
        }
        history.push(path)
    }
};

export const useValidator = (validator) => {

    const [isValid, setIsValid] = useState(false);

    const [value, setValue] = useState("");

    const rule = { rules: [{ validator: (rule, value, callback) =>  validator(rule, value, (e)=> {
                if(e) {
                    setIsValid(false);
                }else {
                    setIsValid(true);
                    callback();
                }
                setValue(value);
            })}] };

    return [isValid, value, rule.rules];
};


export const useService = (service, ...args) => {

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isCompleted, setLoading] = useState(data !== null || error !== null);

    useEffect(() => {
        if(!error && !data){
            setLoading(true);
            service(...args)
                .then(data=> setData(data))
                .catch(error => setError(error))
                .finally(() => setLoading(false))
        }
    }, [service, args, error, data]);

    return [isCompleted, data, error];
};

