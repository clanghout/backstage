/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { Fragment } from 'react';
import startCase from 'lodash/startCase';
import Typography from '@material-ui/core/Typography';

import { MetadataTable, MetadataTableItem } from './MetadataTable';
import { CodeSnippet } from '../CodeSnippet';
import jsyaml from 'js-yaml';

export type StructuredMetadataTableListClassKey = 'root';

export type StructuredMetadataTableNestedListClassKey = 'root';

function toValue(value: object | Array<any> | boolean | string) {
  if (React.isValidElement(value)) {
    return <Fragment>{value}</Fragment>;
  }

  if (value !== null && typeof value === 'object') {
    return (
      <CodeSnippet
        language="yaml"
        text={jsyaml.dump(value)}
        customStyle={{
          background: 'transparent',
          lineHeight: '1.4',
          padding: '0',
          margin: 0,
        }}
      />
    );
  }

  if (typeof value === 'boolean') {
    return <Fragment>{value ? '✅' : '❌'}</Fragment>;
  }

  return (
    <Typography variant="body2" component="span">
      {value}
    </Typography>
  );
}
const ItemValue = ({ value }: { value: any }) => (
  <Fragment>{toValue(value)}</Fragment>
);

const TableItem = ({
  title,
  value,
  options,
}: {
  title: string;
  value: any;
  options: Options;
}) => {
  return (
    <MetadataTableItem title={options.titleFormat(title)}>
      <ItemValue value={value} />
    </MetadataTableItem>
  );
};

function mapToItems(info: { [key: string]: string }, options: Options) {
  return Object.keys(info).map(key => (
    <TableItem key={key} title={key} value={info[key]} options={options} />
  ));
}

/** @public */
export interface StructuredMetadataTableProps {
  metadata: { [key: string]: any };
  dense?: boolean;
  options?: {
    /**
     * Function to format the keys from the `metadata` object. Defaults to
     * startCase from the lodash library.
     * @param key - A key within the `metadata`
     * @returns Formatted key
     */
    titleFormat?: (key: string) => string;
  };
}

type Options = Required<NonNullable<StructuredMetadataTableProps['options']>>;

/** @public */
export function StructuredMetadataTable(props: StructuredMetadataTableProps) {
  const { metadata, dense = true, options = {} } = props;
  const metadataItems = mapToItems(metadata, {
    titleFormat: startCase,
    ...options,
  });
  return <MetadataTable dense={dense}>{metadataItems}</MetadataTable>;
}
