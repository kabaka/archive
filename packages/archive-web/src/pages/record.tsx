import React, {
  useEffect,
  useState,
} from 'react';
import {
  Stack,
  mergeStyles,
} from '@fluentui/react';
import { useLoaderData } from 'react-router-dom';
// eslint-disable-next-line sort-imports
import { TagEditor } from '../components/TagEditor';
import { TxtRenderer } from '../components/renderers/txt';

const rawJsonAreaStyles = mergeStyles({
  maxWidth: '100%',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
});
const metadataAreaStyles = mergeStyles({ maxWidth: '220px' });

export default () => {
  const record: any = useLoaderData();
  const { metadata } = record;
  const [ renderer, setRenderer ] = useState(() => (<span>No Data</span>));

  useEffect(() => {
    switch (metadata.mimeType) {
      case 'text/plain':
        setRenderer(<TxtRenderer record={record} />);
        break;
      default:
        throw new Error(`no renderer available for ${metadata.mimeType}`);
    }
  }, [ metadata.mimeType, record ]);

  // TODO: memoize/cache where possible
  return (
    <Stack>
      <Stack.Item>
        <h2>
          Record
          &nbsp;
          {record.id}
          &nbsp;&bull;&nbsp;
          {metadata.mimeType}
        </h2>
        <hr />
      </Stack.Item>
      <Stack horizontal>
        <Stack.Item disableShrink grow>
          {renderer}
        </Stack.Item>
        <Stack.Item className={metadataAreaStyles}>
          <h3>Metadata</h3>
          <dl>
            {Object.keys(metadata).map((key) => (
              <React.Fragment key={key}>
                <dt>
                  {key.replace(/([A-Z])/gu, ' $1').replace(/^./u, (m) => m.toUpperCase())}
                </dt>
                <dd>
                  {metadata[ key ]}
                </dd>
              </React.Fragment>
            ))}
          </dl>
          <hr />
          <h3>Tags</h3>
          <TagEditor record={record} />
          <hr />
          <h3>Raw Metadata JSON</h3>
          <pre className={rawJsonAreaStyles}>{JSON.stringify(metadata)}</pre>
        </Stack.Item>
      </Stack>
    </Stack>
  );
};
