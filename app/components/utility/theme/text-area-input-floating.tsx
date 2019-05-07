import { Props, Component } from "react";
import * as cx from "classnames";

const DEFAULT_HEIGHT = 115;
interface TextAreaInputFloatingProps extends Props<TextAreaInputFloating> {
    labelText: string;
    onTextChange?: (newText: string) => void;
    onTextClick?: (newText: string) => void;
    initialText?: string;
    rows?: number;
    className?: string;
    inputClassName?: string;
    disabled?: boolean;
    suppressTopMargin?: boolean;
    onFocus?: __React.EventHandler<__React.FocusEvent>;
    onBlur?: __React.EventHandler<__React.FocusEvent>;
    maxHeight?: number;
    isEditMode?: boolean;
    hideBlueLine?: boolean;
}

interface TextAreaInputFloatingState {
    isToggled?: boolean;
    isBlueLine?: boolean;
}

export class TextAreaInputFloating extends Component<TextAreaInputFloatingProps, TextAreaInputFloatingState> {
    textAreaInput: HTMLTextAreaElement;

    constructor(props) {
        super(props);
        this.state = {
            isToggled: !!this.props.initialText,
            isBlueLine: false,
        };
    }

    componentDidMount() {
        // Dynamically set the height of the textarea, it is not possible with CSS only but requires script/jquery
        // Reference Link : http://stackoverflow.com/a/25621277/772086
        let textAreaInput = ReactDOM.findDOMNode(this.textAreaInput);
        $(textAreaInput).css({"height": "auto", "overflow": "auto"}).height(textAreaInput.scrollHeight);
    }

    componentDidUpdate() {
        let textAreaInput = ReactDOM.findDOMNode(this.textAreaInput);
        $(textAreaInput).css({"height": "auto", "overflow": "auto"}).height(textAreaInput.scrollHeight);
    }

    selectText(e) {
        let target = e.target;
        setTimeout(() => {
            target.select();
        }, 0);
    }

    focused = (e: __React.FocusEvent) => {
        this.setState({ isToggled: true, isBlueLine: true });
        if (!!this.props.onFocus) {
            this.props.onFocus(e);
        }
    };

    blurred = (e: __React.FocusEvent) => {
        this.setState({ isToggled: this.textAreaInput.value !== "", isBlueLine: false });
        if (!!this.props.onBlur) {
            this.props.onBlur(e);
        }
    };

    changed = (e) => {
        // To set height of textarea dynamically.
        const { maxHeight } = this.props;
        let textAreaInput = ReactDOM.findDOMNode(e.currentTarget) as HTMLTextAreaElement;
        if (textAreaInput.scrollHeight <= (maxHeight || DEFAULT_HEIGHT)) {
            $(textAreaInput)
                .css({"height": "auto", "overflow": "hidden"}).height(e.currentTarget.scrollHeight);
        } else {
            $(textAreaInput).css({"height": (maxHeight || DEFAULT_HEIGHT) + "px", "overflow": "auto"});
        }
        this.setState({ isToggled: this.textAreaInput.value !== "", isBlueLine: false });

        if (this.props.onTextChange) {
            this.props.onTextChange(this.textAreaInput.value);
        }
    };

    clicked = (e: __React.FormEvent) => {
        if (this.props.onTextClick) {
            this.props.onTextClick(this.textAreaInput.value);
        }
    };

    render() {
        const disabledObj = this.props.disabled ? { disabled: true } : {};

        const { maxHeight, isEditMode, hideBlueLine } = this.props;
        const style = {
            paddingTop: "6px",
            wordWrap: "break-word",
            maxHeight: maxHeight ? maxHeight + "px" : DEFAULT_HEIGHT + "px",
            overflow: "hidden",
            borderBottomColor: (!isEditMode ? "#959595" : ""),
        };

        return (
            <div
                className={cx("fg-line", {"fg-toggled " : (this.state.isToggled
                    || (this.textAreaInput && !!this.textAreaInput.value))},
                    {"fg-blue-line " : this.state.isBlueLine && !hideBlueLine}, this.props.className)}
                style={this.props.suppressTopMargin === true ? {} : { marginTop: "20px" }}
            >
                <textarea
                    style={style}
                    ref={c => this.textAreaInput = c}
                    className={cx("form-control", this.props.inputClassName)}
                    onFocus={this.focused}
                    onBlur={this.blurred}
                    onChange={this.changed}
                    onClick={this.clicked}
                    defaultValue={this.props.initialText || ""}
                    rows={this.props.rows || 1}
                    readOnly={!isEditMode}
                />
                <label htmlFor="localInput" className="fg-label">{this.props.labelText}</label>
            </div>
        );
    }
}
