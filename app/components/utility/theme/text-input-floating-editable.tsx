import { Props, Component } from "react";
import * as cx from "classnames";

interface TextInputFloatingEditableProps extends Props<TextInputFloatingEditable> {
    placeholder?: string;
    isNumber?: boolean;
    minValue?: number;
    maxValue?: number;
    labelText?: string;
    initialText?: string;
    className?: string;
    onTextChange?: (newText: string) => void;
    onFocus?: __React.EventHandler<__React.FocusEvent>;
    onBlur?: __React.EventHandler<__React.FocusEvent>;
    onKeyUp?: __React.EventHandler<__React.KeyboardEvent>;
    height?: number;
    inputClassName?: string;
    isDataEditor?: boolean;
    inputStyle?: any;
    isReadOnly?: boolean;
    suppressTopMargin?: boolean;
    isDelayedTextChange?: boolean;
}

interface TextInputFloatingEditableState {
    isToggled?: boolean;
    isBlueLine?: boolean;
    text?: string;
}

export class TextInputFloatingEditable extends
                Component<TextInputFloatingEditableProps, TextInputFloatingEditableState> {
    textInput: HTMLInputElement;

    constructor(props) {
        super(props);
        this.onTextChange = this.onTextChange.bind(this);
        this.setFocus = this.setFocus.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.state = {
            isToggled: !!this.props.initialText,
            text: this.props.initialText || "",
            isBlueLine: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.initialText) {
            this.setState({
                isToggled: !!nextProps.initialText,
                text: nextProps.initialText || "",
            });
        }
    }

    delayedTextChange = _.debounce(text => {
        if (this.props.onTextChange) {
            this.props.onTextChange(text);
        }
    }, 1000);

    selectText(e) {
        let target = e.target;
        setTimeout(() => {
            target.select();
        }, 0);
    }

    onTextChange(e) {
        let newInputValue = this.textInput.value;
        if (this.props.isNumber) {
            let numberInput = parseFloat(this.textInput.value);
            if (this.props.maxValue && numberInput > this.props.maxValue) {
               newInputValue =  this.props.maxValue.toString();
            } else if (this.props.minValue && numberInput < this.props.minValue) {
                newInputValue =  this.props.minValue.toString();
            }
        }

        this.setState({
                text: newInputValue,
        });
        if (this.props.isDelayedTextChange) {
            this.delayedTextChange(newInputValue);
        } else {
            if (this.props.onTextChange) {
                this.props.onTextChange(newInputValue);
            }
        }
    }

    onFocus(e) {
        this.setState({ isToggled: true, isBlueLine: true });
        if (!!this.props.onFocus) {
            this.props.onFocus(e);
        }
    }

    onBlur(e) {
        this.setState({ isToggled: this.state.text !== "", isBlueLine: false });
        if (!!this.props.onBlur) {
            this.props.onBlur(e);
        }
    }

    onKeyUp(e) {
        if (!!this.props.onKeyUp) {
            this.props.onKeyUp(e);
        }
    }

    setFocus() {
        this.textInput.focus();
    }

    getValue() {
        return this.state.text;
    }

    render() {
        const {labelText, placeholder, height, isDataEditor, inputStyle, isReadOnly} = this.props;
        let style: any = _.assign({}, inputStyle);
        if (height > 0) {
            style.height = height + "px";
        }

        return (
                <div
                    className={cx("fg-line", {"fg-toggled " : (this.state.isToggled ||
                        (this.textInput && (!!this.textInput.value || !!this.state.text)))},
                        {"fg-blue-line " : this.state.isBlueLine && !isReadOnly}, this.props.className)}
                    style={this.props.suppressTopMargin === true ? {} : { marginTop: "20px" }}
                >
                { this.props.isNumber
                    ? <input
                        id="localInput"
                        type="number"
                        min={this.props.minValue}
                        max={this.props.maxValue}
                        ref={(c) => this.textInput = c}
                        className={cx("form-control", this.props.inputClassName)}
                        style={style}
                        placeholder={placeholder}
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
                        onKeyUp={this.onKeyUp}
                        onChange={this.onTextChange}
                        onClick={(e) => {e.preventDefault(); e.stopPropagation(); }}
                        defaultValue={this.state.text}
                        data-is-editor={isDataEditor ? "true" : "false"}
                        />
                    : <input
                        id="localInput"
                        type="text"
                        ref={(c) => this.textInput = c}
                        className={cx("form-control", this.props.inputClassName)}
                        style={style}
                        placeholder={placeholder}
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
                        onKeyUp={this.onKeyUp}
                        onChange={this.onTextChange}
                        onClick={(e) => {e.preventDefault(); e.stopPropagation(); }}
                        defaultValue={this.state.text}
                        data-is-editor={isDataEditor ? "true" : "false"}
                        />
                }
                {labelText ? <label htmlFor="localInput" className="fg-label">{labelText}</label> : null }

                </div>
            );
    }
}
