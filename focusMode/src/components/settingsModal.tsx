import React from 'react';
import { Modal, Switch, Typography, Divider, Space } from 'antd';
import { useFocusMode } from '@/contexts/FocusModeContext';

const { Title, Text } = Typography;

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { isFocusMode, toggleFocusMode } = useFocusMode();

  const handleOk = () => {
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      title={<span style={{ 
        color: isFocusMode 
          ? 'hsla(43, 100%, 14%, 1.00)' 
          : 'hsla(220, 24%, 57%, 1.00)',
        fontWeight: 600
      }}>Settings</span>}
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Done"
      okButtonProps={{
        style: {
          backgroundColor: isFocusMode 
            ? 'hsla(43, 100%, 14%, 1.00)' 
            : 'hsla(220, 24%, 57%, 1.00)',
          borderColor: isFocusMode 
            ? 'hsla(43, 100%, 14%, 1.00)' 
            : 'hsla(220, 24%, 57%, 1.00)',
          color: isFocusMode 
            ? 'hsl(45, 30%, 92%)' 
            : 'white',
        }
      }}
      cancelButtonProps={{ style: { display: 'none' } }}
      width={400}
      styles={{
        content: {
          backgroundColor: isFocusMode 
            ? 'hsl(45, 30%, 92%)' 
            : 'hsl(220, 30%, 15%)',
          transition: 'background-color 0.4s ease',
        },
        header: {
          backgroundColor: isFocusMode 
            ? 'hsl(45, 30%, 92%)' 
            : 'hsl(220, 30%, 15%)',
          borderBottom: `1px solid ${isFocusMode 
            ? 'hsla(43, 100%, 14%, 0.1)' 
            : 'hsla(220, 24%, 57%, 0.2)'}`,
        },
        footer: {
          backgroundColor: isFocusMode 
            ? 'hsl(45, 30%, 92%)' 
            : 'hsl(220, 30%, 15%)',
          borderTop: `1px solid ${isFocusMode 
            ? 'hsla(43, 100%, 14%, 0.1)' 
            : 'hsla(220, 24%, 57%, 0.2)'}`,
        }
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div>
          <Title 
            level={5} 
            style={{ 
              color: isFocusMode 
                ? 'hsla(43, 100%, 14%, 1.00)' 
                : 'hsla(220, 24%, 57%, 1.00)',
              margin: '0 0 12px 0'
            }}
          >
            Focus Mode
          </Title>
          <Space align="center">
            <Switch 
              checked={isFocusMode} 
              onChange={toggleFocusMode}
              size="default"
              style={{
                backgroundColor: !isFocusMode ? '#1890ff' : undefined,
              }}
            />
            <Text style={{ 
              color: isFocusMode 
                ? 'hsla(43, 100%, 14%, 0.85)' 
                : 'hsla(220, 24%, 70%, 1.00)',
              fontWeight: 500
            }}>
              {isFocusMode ? 'Focus mode is ON' : 'Focus mode is OFF'}
            </Text>
          </Space>
          <Text 
            style={{ 
              display: 'block', 
              marginTop: 8,
              color: isFocusMode 
                ? 'hsla(43, 100%, 14%, 0.65)' 
                : 'hsla(220, 24%, 57%, 0.8)',
              fontSize: '13px',
              lineHeight: '1.4'
            }}
          >
            Toggle focus mode to enhance your concentration while browsing YouTube.
          </Text>
        </div>

        <Divider style={{ 
          borderColor: isFocusMode 
            ? 'hsla(43, 100%, 14%, 0.15)' 
            : 'hsla(220, 24%, 57%, 0.25)',
          margin: '16px 0'
        }} />

        <div>
          <Title 
            level={5}
            style={{ 
              color: isFocusMode 
                ? 'hsla(43, 100%, 14%, 1.00)' 
                : 'hsla(220, 24%, 57%, 1.00)',
              margin: '0 0 8px 0'
            }}
          >
            About
          </Title>
          <Text style={{ 
            color: isFocusMode 
              ? 'hsla(43, 100%, 14%, 0.65)' 
              : 'hsla(220, 24%, 57%, 0.8)',
            fontSize: '13px',
            lineHeight: '1.5'
          }}>
            YouTube Focus Mode extension helps you stay focused by reducing distractions 
            and creating a more productive browsing experience.
          </Text>
        </div>
      </Space>
    </Modal>
  );
};

export default SettingsModal;
