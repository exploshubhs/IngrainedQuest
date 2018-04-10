import { Props, Component } from "react";
import * as cx from "classnames";
import * as Accounting from "accounting";

export enum FormInputValueType {
    Money, Percentage
}

interface FormInputFloatingEditableProps extends Props<FormInputFloatingEditable> {
    placeholder?: string;
    labelText?: string;
    text?: string;
    onTextChange?: (newText: string) => void;
    onFocus?: __React.EventHandler<__React.FocusEvent>;
    onBlur?: __React.EventHandler<__React.FocusEvent>;
    height?: number;
    inputClassName?: string;
    isEditing?: boolean;
    inputType?: FormInputValueType;
}

interface FormInputFloatingEditableState {
    isToggled?: boolean;
    text?: string;
    isFocused?: boolean;
}

const formatPctValue = (value: number) => {
    if (_.isFinite(value)) {
        return _.round(value, 3).toString() + "%";
    }
    return "0%";
};

const validate = (value: string) => {
    if (value && value.length > 0) {
        let numberValue = parseFloat(value);
        return _.isFinite(numberValue);
    }
    return false;
};

export class FormInputFloatingEditable extends
                Component<FormInputFloatingEditableProps, FormInputFloatingEditableState> {

    textInput: HTMLInputElement;

    change = _.debounce((value) => {
        const {onTextChange} = this.props;
        if (onTextChange) {
            onTextChange(validate(value) ? value : "0");
        }
    }, 400);

    constructor(props) {
        super(props);
        this.onTextChange = this.onTextChange.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        const {text} = this.props;
        this.state = {
            isToggled: !!text,
            text,
            isFocused: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        const {isFocused} = this.state;
        if (!isFocused) {
            const {text} = nextProps;
            if (text) {
                this.setState({
                    isToggled: !!text,
                    text,
                });
            }
        }
    }

    onTextChange() {
        const value = this.textInput.value;
        this.setState({text: value});
        this.change(value);
    }

    onFocus(e: __React.FocusEvent) {
        this.setState({ isToggled: true, isFocused: true });
        if (this.props.onFocus) {
            this.props.onFocus(e);
        }
    }

    onBlur(e: __React.FocusEvent) {
        this.setState({ isToggled: this.props.text !== "", isFocused: false });
        if (this.props.onBlur) {
            this.props.onBlur(e);
        }
    }

    format(value: string) {
        const {inputType} = this.props;
        let numberValue = value ? parseFloat(value) : 0;
        let result;
        switch (inputType) {
            case FormInputValueType.Money:
                result = Accounting.formatMoney(numberValue);
                break;
            case FormInputValueType.Percentage:
                result = formatPctValue(numberValue);
                break;
            default:
                result = Accounting.formatMoney(numberValue);
                break;
        }
        return result;
    }

    render() {
        const {isToggled, text} = this.state;
        const {labelText, placeholder, height, inputClassName, isEditing, inputType} = this.props;
        const lineStyle = {
            marginTop: labelText ? "20px" : "0px",
        };
        let inputStyle: any = {};
        if (height > 0) {
            inputStyle.height = height + "px";
        }
        let value;
        if (text && text.length > 0) {
            value = isEditing ? text : this.format(text);
        } else {
            value = "";
        }
        return (
            <div
                className={"form-group" + (validate(value) ? "" : " has-error") + (!isEditing ? " read-only-mode" : "")}
                style={{display: "block", marginBottom: 0}}
            >
                <div
                    className={"fg-line" + (isToggled ? " fg-toggled" : "") }
                    style={lineStyle}
                >
                    {labelText ? <label htmlFor="localInput" className="fg-label">{labelText}</label> : null }
                    <input
                        tabIndex={!isEditing ? -1 : 0}
                        id="localInput"
                        type="text"
                        ref={c => this.textInput = c}
                        className={cx("form-control", inputClassName)}
                        style={inputStyle}
                        placeholder={placeholder}
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
                        onChange={this.onTextChange}
                        onClick={e => {e.preventDefault(); e.stopPropagation(); }}
                        value={value}
                    />
                    {(isEditing && inputType === FormInputValueType.Percentage
                        && this.textInput && this.textInput.value) ? "%" : ""}
                </div>
            </div>
        );
    }
}
