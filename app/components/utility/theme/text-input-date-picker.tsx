import { Props, Component } from "react";
import * as cx from "classnames";

interface TextInputDatePickerProps extends Props<TextInputDatePicker> {
    labelText: string;
    onTextChange?: (newText: string) => void;
    onTextClick?: (newText: string) => void;
    initialText?: string;
    className?: string;
    inputClassName?: string;
    disabled?: boolean;
    suppressTopMargin?: boolean;
    onFocus?: __React.EventHandler<__React.FocusEvent>;
    onBlur?: __React.EventHandler<__React.FocusEvent>;
    verticalPosition?: string;
    horizontalPosition?: string;
    placeholder?: string;
    isReadOnly?: boolean;
    dateFormat?: string;
}

interface TextInputDatePickerState {
    isToggled?: boolean;
    isBlueLine?: boolean;
}

export class TextInputDatePicker extends Component<TextInputDatePickerProps, TextInputDatePickerState> {
    textInputDatePicker: HTMLInputElement;

    constructor(props) {
        super(props);
        this.state = {
            isToggled: !!this.props.initialText,
            isBlueLine: false,
        };
    }

    componentDidUpdate() {
        const { dateFormat } = this.props;
        let widgetPositioning: any = {
            vertical: this.props.verticalPosition || "top",
            horizontal: this.props.horizontalPosition || "left",
        };

        if (this.textInputDatePicker) {
            $(this.textInputDatePicker).datetimepicker({
                format: dateFormat || "M/D/YY",
                extraFormats: ["'MMM D, YYYY'", "M/D/YYYY", "MM/DD/YYYY"],
                useCurrent: false,
                defaultDate: null,
                widgetPositioning:  widgetPositioning,
            });

            // Added for changing value when date is selected from datepicker
            $(this.textInputDatePicker).on("dp.change", (e) => {
                this.changed();
            });
        }
    }

    focused = (e: __React.FocusEvent) => {
        this.setState({ isToggled: true, isBlueLine: true });
        if (!!this.props.onFocus) {
            this.props.onFocus(e);
        }
    };

    blurred = (e: __React.FocusEvent) => {
        this.setState({ isToggled: this.textInputDatePicker.value !== "", isBlueLine: false });
        if (!!this.props.onBlur) {
            this.props.onBlur(e);
        }
    };

    changed = () => {
        if (this.props.onTextChange) {
            this.props.onTextChange(this.textInputDatePicker.value);
        }
    };

    clicked = (e: __React.FormEvent) => {
        if (this.props.onTextClick) {
            this.props.onTextClick(this.textInputDatePicker.value);
        }
    };

    getDate = () => {
        return $(this.textInputDatePicker).data("DateTimePicker").date();
    };

    render() {
        const disabledObj = this.props.disabled ? { disabled: true } : {};
        const {labelText, placeholder, suppressTopMargin} = this.props;
        const lineStyle = {
            marginTop: labelText ? (!suppressTopMargin ? "20px" : "") : "0px",
        };
        return (
            <div className={cx("fg-line dtp-container", {"fg-toggled " : (this.state.isToggled ||
                            (this.textInputDatePicker && !!this.textInputDatePicker.value))},
                             {"fg-blue-line " : this.state.isBlueLine && !this.props.isReadOnly}, this.props.className)}
                 style={lineStyle}>
                <input type="text"
                    ref={c => this.textInputDatePicker = c}
                    className={cx("form-control fg-input date-picker", this.props.inputClassName)}
                    onFocus={this.focused}
                    onBlur={this.blurred}
                    onChange={this.changed}
                    onClick={this.clicked}
                    placeholder={placeholder}
                    defaultValue={this.props.initialText || ""}
                    readOnly={this.props.isReadOnly}
                    {...disabledObj}
                    />
                {labelText ? <label htmlFor="localInput" className="fg-label">{labelText}</label> : null }
            </div>
        );
    }
}
