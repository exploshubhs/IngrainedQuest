import { Props, Component } from "react";
import * as cx from "classnames";

interface TextInputFloatingProps extends Props<TextInputFloating> {
    labelText: string;
    initialText?: string;
    value?: string;
    className?: string;
    inputClassName?: string;
    disabled?: boolean;
    suppressTopMargin?: boolean;
    style?: any;
    setInitialFocus?: boolean;
    onTextChange?: (newText: string) => void;
    onTextClick?: (newText: string) => void;
    onFocus?: __React.EventHandler<__React.FocusEvent>;
    onBlur?: __React.EventHandler<__React.FocusEvent>;
    isPassword?: boolean;
    placeholder?: string;
    isDataEditor?: boolean;
    isReadOnly?: boolean;
    isRequiredMessage?: string;
    autoComplete?: string; // use "new-password" to disable autofill - stackoverflow.com/questions/15738259
}

interface TextInputFloatingState {
    isToggled?: boolean;
    isBlueLine?: boolean;
    isEmpty?: boolean;
}

export class TextInputFloating extends Component<TextInputFloatingProps, TextInputFloatingState> {
    textInput: HTMLInputElement;

    constructor(props) {
        super(props);
        const initialValueExist = !!this.props.initialText || !!this.props.value;
        this.state = {
            isToggled: initialValueExist,
            isBlueLine: false,
            isEmpty: !initialValueExist,
        };
    }

    componentDidMount() {
        if (this.props.setInitialFocus) {
            this.textInput.focus();
        }
    }

    selectText(e) {
        const target = e.target;
        setTimeout(() => { target.select(); }, 0);
    }

    focused = (e: __React.FocusEvent) => {
        this.setState({ isToggled: true, isBlueLine: true });
        if (!!this.props.onFocus) {
            this.props.onFocus(e);
        }
    };

    blurred = (e: __React.FocusEvent) => {
        this.setState({ isToggled: this.textInput.value !== "", isBlueLine: false });
        if (!!this.props.onBlur) {
            this.props.onBlur(e);
        }
    };

    changed = (e: __React.FormEvent) => {
        if (this.props.onTextChange) {
            this.props.onTextChange(this.textInput.value);
        }
        if (!!this.props.isRequiredMessage && this.textInput) {
            this.setState({
                isEmpty: !this.textInput.value,
            });
        }
    };

    clicked = (e: __React.FormEvent) => {
        if (this.props.onTextClick) {
            this.props.onTextClick(this.textInput.value);
        }
    };

    value = () => {
        return this.textInput.value;
    };

    setFocus = () => {
        this.textInput.focus();
    };

    render() {
        const { isReadOnly, isRequiredMessage, autoComplete } = this.props;
        const disabledObj = this.props.disabled ? { disabled: true } : {};
        return (
            <div className={cx({"has-error " : (!!this.props.isRequiredMessage && this.state.isEmpty)})}>
                <div
                    className={cx("fg-line ", {"fg-toggled " : (this.state.isToggled ||
                        (this.textInput && (!!this.textInput.value || !!this.props.value)))},
                        {"fg-blue-line " : this.state.isBlueLine && !isReadOnly}, this.props.className)}
                    style={this.props.suppressTopMargin === true ? {} : { marginTop: "20px" }}
                >
                    {/*Uncontrolled*/}
                    {_.isUndefined(this.props.value) &&
                        <input
                            type={this.props.isPassword ? "password" : "text"}
                            ref={c => this.textInput = c}
                            className={cx("form-control fg-input", this.props.inputClassName)}
                            onFocus={this.focused}
                            onBlur={this.blurred}
                            onChange={this.changed}
                            onClick={this.clicked}
                            placeholder={this.props.placeholder}
                            defaultValue={this.props.initialText || ""}
                            data-is-editor={this.props.isDataEditor ? "true" : "false"}
                            readOnly={isReadOnly}
                            autoComplete={autoComplete ? autoComplete : ""}
                            {...disabledObj}
                        />
                    }
                    {/*Controlled*/}
                    {_.isUndefined(this.props.initialText) &&
                        <input
                            type={this.props.isPassword ? "password" : "text"}
                            ref={c => this.textInput = c}
                            style={this.props.style}
                            className={cx("form-control fg-input", this.props.inputClassName)}
                            onFocus={this.focused}
                            onBlur={this.blurred}
                            onChange={this.changed}
                            onClick={this.clicked}
                            placeholder={this.props.placeholder}
                            value={this.props.value}
                            data-is-editor={this.props.isDataEditor ? "true" : "false"}
                            {...disabledObj}
                            readOnly={isReadOnly}
                        />
                    }
                    <label htmlFor="localInput" className="fg-label">{this.props.labelText}</label>
                </div>
                {(!!isRequiredMessage && this.state.isEmpty) &&
                    <small className="help-block" >
                        {isRequiredMessage}
                    </small>
                }
            </div>
        );
    }
}
