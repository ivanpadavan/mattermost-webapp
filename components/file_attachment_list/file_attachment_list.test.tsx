// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {shallow} from 'enzyme';

import {TestHelper} from 'utils/test_helper';

import FileAttachment from 'components/file_attachment';
import SingleImageView from 'components/single_image_view';

import FileAttachmentList from './file_attachment_list';

describe('FileAttachmentList', () => {
    const post = TestHelper.getPostMock({
        id: 'post_id',
        file_ids: ['file_id_1', 'file_id_2', 'file_id_3'],
    });
    const fileInfos = [
        TestHelper.getFileInfoMock({id: 'file_id_3', name: 'image_3.png', extension: 'png', create_at: 3}),
        TestHelper.getFileInfoMock({id: 'file_id_2', name: 'image_2.png', extension: 'png', create_at: 2}),
        TestHelper.getFileInfoMock({id: 'file_id_1', name: 'image_1.png', extension: 'png', create_at: 1}),
    ];
    const baseProps = {
        post,
        fileCount: 3,
        fileInfos,
        compactDisplay: false,
        enableSVGs: false,
        isEmbedVisible: false,
        locale: 'en',
        handleFileDropdownOpened: jest.fn(),
        actions: {
            openModal: jest.fn(),
        },
        pluginFileAttachmentComponents: [],
    };

    test('should render a FileAttachment for a single file', () => {
        const props = {
            ...baseProps,
            fileCount: 1,
            fileInfos: [
                TestHelper.getFileInfoMock({
                    id: 'file_id_1',
                    name: 'file.txt',
                    extension: 'txt',
                }),
            ],
        };

        const wrapper = shallow(
            <FileAttachmentList {...props}/>,
        );

        expect(wrapper.find(FileAttachment).exists()).toBe(true);
    });

    test('should render multiple, sorted FileAttachments for multiple files', () => {
        const wrapper = shallow(
            <FileAttachmentList {...baseProps}/>,
        );

        expect(wrapper.find(FileAttachment)).toHaveLength(3);
        expect(wrapper.find(FileAttachment).first().prop('fileInfo').id).toBe('file_id_1');
        expect(wrapper.find(FileAttachment).last().prop('fileInfo').id).toBe('file_id_3');
    });

    test('should render a SingleImageView for a single image', () => {
        const props = {
            ...baseProps,
            fileCount: 1,
            fileInfos: [
                TestHelper.getFileInfoMock({id: 'file_id_1', name: 'image.png', extension: 'png'}),
            ],
        };

        const wrapper = shallow(
            <FileAttachmentList {...props}/>,
        );

        expect(wrapper.find(SingleImageView).exists()).toBe(true);
    });

    test('should render a SingleImageView for an SVG with SVG previews enabled', () => {
        const props = {
            ...baseProps,
            enableSVGs: true,
            fileCount: 1,
            fileInfos: [
                TestHelper.getFileInfoMock({id: 'file_id_1', name: 'image.svg', extension: 'svg'}),
            ],
        };

        const wrapper = shallow(
            <FileAttachmentList {...props}/>,
        );

        expect(wrapper.find(SingleImageView).exists()).toBe(true);
    });

    test('should render a FileAttachment for an SVG with SVG previews disabled', () => {
        const props = {
            ...baseProps,
            fileCount: 1,
            fileInfos: [
                TestHelper.getFileInfoMock({id: 'file_id_1', name: 'image.svg', extension: 'svg'}),
            ],
        };

        const wrapper = shallow(
            <FileAttachmentList {...props}/>,
        );

        expect(wrapper.find(SingleImageView).exists()).toBe(false);
        expect(wrapper.find(FileAttachment).exists()).toBe(true);
    });

    test('should render plugin previews if some are registered', () => {
        const AudioCmp = ((props) => <p>{props.fileInfo.name}</p>) as typeof FileAttachment;
        const VideoCmp = ((props) => <p>{props.fileInfo.extension}</p>) as typeof FileAttachment;
        const props = {
            ...baseProps,
            fileCount: 2,
            fileInfos: [
                TestHelper.getFileInfoMock({id: 'file_id_1', name: 'audio.mp3', extension: 'mp3'}),
                TestHelper.getFileInfoMock({id: 'file_id_2', name: 'video.mp4', extension: 'mp4'}),
                TestHelper.getFileInfoMock({id: 'file_id_3', name: 'image.png', extension: 'png'}),
            ],
        };

        const wrapper = shallow(
            <FileAttachmentList
                {...props}
                pluginFileAttachmentComponents={[
                    {
                        id: '1',
                        pluginId: '1',
                        component: AudioCmp,
                        match: (fileInfo) => fileInfo.extension === 'mp3',
                    },
                    {
                        id: '2',
                        pluginId: '2',
                        component: VideoCmp,
                        match: (fileInfo) => fileInfo.extension === 'mp4',
                    },
                ]}
            />,
        );
        expect(wrapper.find(AudioCmp).exists()).toBe(true);
        expect(wrapper.find(VideoCmp).exists()).toBe(true);
        expect(wrapper.find(FileAttachment).exists()).toBe(true);
    });
});
