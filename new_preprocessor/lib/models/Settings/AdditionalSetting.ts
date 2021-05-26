export class AdditionalSetting {
    public label: string;
    public content: string;
    public display: boolean;
    public enabled: boolean;

    public constructor(
        label: string,
        content: string,
        display: boolean,
        enabled: boolean
    ) {
        this.label = label;
        this.content = content;
        this.display = display;
        this.enabled = enabled;
    }
}
