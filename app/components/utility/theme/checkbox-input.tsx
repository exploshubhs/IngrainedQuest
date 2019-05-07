import { Props, Component } from "react";
import * as cx from "classnames";
import { OverlayTrigger, Popover } from "react-bootstrap";

const infoStyle = {
    paddingLeft: "5px",
    fontSize: "15px",
    display: "inline-block",
    verticalAlign: "middle",
};

interface CheckboxInputProps extends Props<CheckboxInput> {
    labelText: string;
    initialChecked?: boolean;
    className?: string;
    height?: string;
    onCheckboxChange?: (newText: boolean | string) => void;
    onFocus?: __React.EventHandler<__React.FocusEvent>;
    onBlur?: __React.EventHandler<__React.FocusEvent>;
    isRadio?: boolean;
    name?: string;
    value?: string;
    hideBottomLine?: boolean;
    showInfo?: boolean;
    description?: string;
}

interface CheckboxInputState {
    focusCheckbox?: boolean;
}

export class CheckboxInput extends Component<CheckboxInputProps, CheckboxInputState> {
    checkboxInput: HTMLInputElement;

    constructor(props) {
        super(props);
        this.state = {
            focusCheckbox: false,
        };
    }

    focused = (e: __React.FocusEvent) => {
        this.setState({ focusCheckbox: true });
        if (!!this.props.onFocus) {
            this.props.onFocus(e);
        }
    };

    blurred = (e: __React.FocusEvent) => {
        this.setState({ focusCheckbox: false });
        if (!!this.props.onBlur) {
            this.props.onBlur(e);
        }
    };

    changed = (e: __React.FormEvent) => {
        const { value, isRadio } = this.props;
        if (this.props.onCheckboxChange) {
            if (isRadio && value) {
                this.props.onCheckboxChange(value);
            } else {
                this.props.onCheckboxChange(this.checkboxInput.checked);
            }
        }
    };

    render() {
        const { isRadio, name, hideBottomLine, showInfo, description } = this.props;
        return (
            <div className={cx((isRadio ? "radio" : "checkbox"),
                {"focus-checkbox " : (this.state.focusCheckbox && !hideBottomLine)}, this.props.className)}
                 style={{height: (this.props.height || "28px")}}>
                <label>{this.props.labelText}</label>
                <input type={isRadio ? "radio" : "checkbox"}
                       ref={c => this.checkboxInput = c}
                       name={name || ""}
                       defaultChecked={this.props.initialChecked || false}
                       onFocus={this.focused}
                       onBlur={this.blurred}
                       onClick={e => {e.stopPropagation();}}
                       onChange={this.changed} />
                <i className="input-helper"/>
                {showInfo &&
                    <OverlayTrigger
                        trigger={"hover"}
                        placement="top"
                        overlay={<Popover id="info">{description}</Popover>}
                    >
                        <div style={infoStyle}>
                            <i className="zmdi zmdi-info-outline" />
                        </div>
                    </OverlayTrigger>
                }
            </div>
        );
    }
}
