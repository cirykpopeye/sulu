// @flow
import React from 'react';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import ResourceLocatorComponent from '../../../components/ResourceLocator';
import ResourceLocatorHistory from '../../../containers/ResourceLocatorHistory';
import Requester from '../../../services/Requester';
import type {FieldTypeProps} from '../../../types';
import resourceLocatorStyles from './resourceLocator.scss';
import {translate} from '../../../utils/Translator';
import Button from '../../../components/Button';

const PART_TAG = 'sulu.rlp.part';

const HOMEPAGE_RESOURCE_LOCATOR = '/';

@observer
class ResourceLocator extends React.Component<FieldTypeProps<?string>> {
    @observable mode: string;
    @observable tagValuesChanged: string;

    constructor(props: FieldTypeProps<?string>) {
        super(props);

        const {dataPath, fieldTypeOptions, formInspector, value} = this.props;
        const {generationUrl, modeResolver} = fieldTypeOptions;

        if (!modeResolver) {
            throw new Error('The "modeResolver" must be a function returning a promise with the desired mode');
        }

        modeResolver(this.props).then(action((mode) => this.mode = mode));

        if (!generationUrl) {
            return;
        }

        if (typeof generationUrl !== 'string') {
            throw new Error('The "generationUrl" fieldTypeOption must be a string!');
        }

        if (value === HOMEPAGE_RESOURCE_LOCATOR) {
            return;
        }

        this.tagValuesChanged = false;

        formInspector.addFinishFieldHandler((finishedFieldDataPath, finishedFieldSchemaPath) => {
            const {tags: finishedFieldTags} = formInspector.getSchemaEntryByPath(finishedFieldSchemaPath) || {};
            if (!finishedFieldTags || !finishedFieldTags.some((tag) => tag.name === PART_TAG)) {
                return;
            }

            this.tagValuesChanged = true;

            if (value !== undefined) {
                return;
            }

            if (formInspector.isFieldModified(dataPath)) {
                return;
            }

            this.generateUrl();
        });
    }

    handleBlur = () => {
        const {onFinish} = this.props;
        onFinish();
    };

    generateUrl = () => {
        const {onChange, fieldTypeOptions, formInspector} = this.props;
        const {generationUrl} = fieldTypeOptions;

        const partEntries = formInspector.getPathsByTag(PART_TAG)
            .map((path: string) => [path, formInspector.getValueByPath(path)])
            .filter(([, value: mixed]) => !!value)
            .map(([path: string, value: mixed]) => {
                // path is a jsonpointer but the api controller requires property names
                if (path.startsWith('/')) {
                    return [path.substr(1), value];
                }

                return [path, value];
            });

        if (partEntries.length === 0) {
            return;
        }

        Requester.post(
            generationUrl,
            {
                parts: Object.fromEntries(partEntries),
                resourceKey: formInspector.resourceKey,
                locale: formInspector.locale ? formInspector.locale.get() : undefined,
                ...formInspector.options,
            }
        ).then((response) => {
            onChange(response.resourcelocator);
        }).then(action(() => this.tagValuesChanged = false));
    };

    handleRegenerateButtonClick = async () => {
        this.generateUrl();
    };

    render() {
        if (!this.mode) {
            return null;
        }

        const {
            fieldTypeOptions: {
                historyResourceKey,
                options = {},
            },
        } = this.props;

        if (!historyResourceKey || typeof historyResourceKey !== 'string') {
            throw new Error('The "historyResourceKey" field type option must be set to a string!');
        }

        if (typeof options !== 'object') {
            throw new Error('The "options" field type must be an object if given!');
        }

        const {
            dataPath,
            disabled,
            formInspector,
            onChange,
            value,
        } = this.props;

        if (value === HOMEPAGE_RESOURCE_LOCATOR) {
            return '/';
        }

        return (
            <div className={resourceLocatorStyles.resourceLocatorContainer}>
                <div className={resourceLocatorStyles.resourceLocator}>
                    <ResourceLocatorComponent
                        disabled={!!disabled}
                        id={dataPath}
                        mode={this.mode}
                        onBlur={this.handleBlur}
                        onChange={onChange}
                        value={value}
                    />
                </div>
                {formInspector.id &&
                    <div className={resourceLocatorStyles.resourceLocatorActions}>
                        <Button icon="su-sync" onClick={this.handleRegenerateButtonClick} skin="link" disabled={!this.tagValuesChanged}>
                            {translate('sulu_admin.regenerate_url')}
                        </Button>
                        <ResourceLocatorHistory
                            id={formInspector.id}
                            options={{
                                locale: formInspector.locale,
                                resourceKey: formInspector.resourceKey,
                                webspace: formInspector.options.webspace,
                                ...options,
                            }}
                            resourceKey={historyResourceKey}
                        />
                    </div>
                }
            </div>
        );
    }
}

export default ResourceLocator;
