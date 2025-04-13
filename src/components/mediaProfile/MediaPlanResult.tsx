import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Spin, message, Typography, Empty } from 'antd';
import { generateMediaPlanWithSSE, saveMediaPlan } from '../../services/mediaProfileService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BookOutlined, FilePdfOutlined, CopyOutlined, DownloadOutlined } from '@ant-design/icons';
import './mediaPlanResult.css';
// 导入PDF生成库
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const { Paragraph } = Typography;

interface MediaProfile {
  id: string;
  nickname: string;
  age: number;
  occupation: string;
  personalityTraits: string;
  educationBackground: string;
  mediaPlat: string | string[];
  careerExperience?: string;
  specialExperience?: string;
  uniqueExperience?: string;
  interests?: string;
  targetTrack?: string;
  targetAudience?: string;
  contentCreationAbility?: string;
  accountPurpose?: string;
  shortTermGoals?: string;
  benchmarkAccounts?: string;
  mediaPlan?: string;
  createdAt: string;
}

interface MediaPlanResultProps {
  profile: MediaProfile;
}

const MediaPlanResult: React.FC<MediaPlanResultProps> = ({ profile }) => {
  const [loading, setLoading] = useState(false);
  const [planContent, setPlanContent] = useState<string>('');
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copying, setCopying] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // 初始化时，如果档案已有策划方案，则直接显示
  useEffect(() => {
    if (profile.mediaPlan) {
      // 修复可能的Markdown格式问题，特别是表格相关的
      const fixedContent = fixMarkdownTableFormat(profile.mediaPlan);
      setPlanContent(fixedContent);
    } else {
      setPlanContent('');
    }
  }, [profile]);

  // 修复Markdown表格格式的函数
  const fixMarkdownTableFormat = (content: string): string => {
    if (!content) return '';
    
    // 1. 确保表格前后有空行
    let fixedContent = content.replace(/([^\n])([\r\n]*)((\|[^\n]*\|[\r\n]*)+)/g, '$1\n\n$3');
    fixedContent = fixedContent.replace(/((\|[^\n]*\|[\r\n]*)+)([^\n])/g, '$1\n\n$3');
    
    // 2. 确保表格行有正确的格式（每行有相同数量的|符号）
    const lines = fixedContent.split('\n');
    let inTable = false;
    let columnCount = 0;
    let fixedLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // 检测是否为表格行
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        const pipeCount = (line.match(/\|/g) || []).length;
        
        // 如果这是表格的第一行，记录列数
        if (!inTable) {
          inTable = true;
          columnCount = pipeCount;
        }
        
        // 确保所有的表格行有相同数量的列
        if (inTable && pipeCount !== columnCount) {
          // 修复列数不一致的行
          console.log('修复了表格行:', line, '当前列数:', pipeCount, '应有列数:', columnCount);
          // 这里可以添加修复代码，但通常情况下，只需提醒前端开发者即可
        }
        
        fixedLines.push(line);
      } else {
        // 如果不是表格行，重置表格状态
        if (inTable) {
          inTable = false;
          columnCount = 0;
        }
        fixedLines.push(line);
      }
    }
    
    return fixedLines.join('\n');
  };

  // 判断是否已有策划方案
  const hasExistingPlan = !!profile.mediaPlan && profile.mediaPlan.trim() !== '';

  // 保存媒体策划方案
  const savePlan = async (content: string) => {
    if (!content.trim()) return;
    
    try {
      setSaving(true);
      await saveMediaPlan(profile.id, content);
      message.success('策划方案保存成功');
    } catch (error) {
      console.error('保存策划方案失败:', error);
      message.error('保存策划方案失败，请稍后重试');
    } finally {
      setSaving(false);
    }
  };

  // 生成媒体策划方案
  const handleGeneratePlan = () => {
    setGenerating(true);
    setLoading(true);
    setPlanContent('');
    
    let finalContent = ''; // 用于存储最终的完整内容
    
    // 使用SSE工具处理流式响应
    generateMediaPlanWithSSE({
      id: profile.id,
      onStart: () => {
        console.log('开始生成媒体策划方案');
      },
      onMessage: (content) => {
        // 确保内容实时更新到UI
        setPlanContent(prev => {
          const newContent = prev + content;
          finalContent = newContent; // 同时更新闭包外的变量
          console.log('收到新内容，当前长度:', newContent.length);
          return newContent;
        });
      },
      onError: (error) => {
        console.error('生成策划方案失败:', error);
        message.error('生成策划方案失败，请稍后重试');
        setGenerating(false);
        setLoading(false);
      },
      onDone: () => {
        console.log('策划方案生成完成，最终内容长度:', finalContent.length);
        message.success('策划方案生成完成');
        setGenerating(false);
        setLoading(false);
        
        // 生成完成后自动保存
        if (finalContent && finalContent.trim() !== '') {
          console.log('准备保存策划方案...');
          savePlan(finalContent);
        } else {
          console.error('策划方案内容为空，无法保存');
          message.warning('策划方案内容为空，无法保存');
        }
      }
    });
  };

  // 复制文本功能
  const handleCopyText = () => {
    if (!contentRef.current) return;
    
    const textContent = contentRef.current.textContent || '';
    
    // 使用navigator.clipboard API复制文本
    navigator.clipboard.writeText(textContent)
      .then(() => {
        message.success('文本已复制到剪贴板');
      })
      .catch(() => {
        message.error('复制失败，请手动选择文本复制');
      });
  };

  // 下载PDF功能
  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;
    
    try {
      message.loading({ content: '正在生成PDF，请稍候...', key: 'pdfDownload' });
      
      // 创建临时容器，复制内容并设置样式
      const container = document.createElement('div');
      container.style.width = '800px';
      container.style.padding = '40px';
      container.style.backgroundColor = 'white';
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.fontFamily = 'SimSun, Microsoft YaHei, sans-serif';
      container.style.visibility = 'hidden'; // 隐藏但保持布局
      container.style.lineHeight = '1.8'; // 增加行高，减少文本被裁剪的风险
      document.body.appendChild(container);
      
      // 添加标题
      const titleElement = document.createElement('h1');
      titleElement.style.fontSize = '24px';
      titleElement.style.textAlign = 'center';
      titleElement.style.marginBottom = '30px'; // 增加底部边距
      titleElement.style.paddingBottom = '15px'; // 增加底部内边距
      titleElement.style.borderBottom = '1px solid #eaeaea';
      titleElement.style.color = '#2E7D32';
      titleElement.style.fontWeight = 'bold';
      titleElement.style.lineHeight = '1.4';
      titleElement.innerText = `${profile.nickname || '媒体'}的专属自媒体策划方案`;
      container.appendChild(titleElement);
      
      // 复制内容元素，保留所有样式
      const contentElement = document.createElement('div');
      contentElement.innerHTML = contentRef.current.innerHTML;
      
      // 添加PDF优化样式
      contentElement.style.fontSize = '14px';
      contentElement.style.lineHeight = '1.8';
      contentElement.style.color = '#333';
      contentElement.style.paddingBottom = '40px'; // 增加底部内边距，确保内容不被裁剪
      
      // 查找并优化所有段落和表格，确保在生成PDF时不会被截断
      const paragraphs = contentElement.querySelectorAll('p, h1, h2, h3, h4, h5, h6, ul, ol');
      paragraphs.forEach(element => {
        if (element instanceof HTMLElement) {
          element.style.marginBottom = '16px';
          element.style.lineHeight = '1.8';
          element.style.pageBreakInside = 'avoid';
        }
      });
      
      // 特殊处理表格
      const tables = contentElement.querySelectorAll('table');
      tables.forEach(table => {
        if (table instanceof HTMLElement) {
          table.style.pageBreakInside = 'avoid';
          table.style.marginTop = '24px';
          table.style.marginBottom = '32px';
          table.style.borderCollapse = 'collapse';
          table.style.width = '100%';
          
          // 确保表格内的内容也有良好的间距
          const cells = table.querySelectorAll('th, td');
          cells.forEach(cell => {
            if (cell instanceof HTMLElement) {
              cell.style.padding = '10px';
              cell.style.border = '1px solid #ddd';
              cell.style.lineHeight = '1.6';
            }
          });
        }
      });
      
      container.appendChild(contentElement);
      
      // 等待DOM渲染完成
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 使用html2canvas将容器渲染为图像
      const canvas = await html2canvas(container, {
        scale: 2, // 提高分辨率
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: container.offsetWidth,
        height: container.offsetHeight,
        windowWidth: container.scrollWidth + 100,
        windowHeight: container.scrollHeight + 100,
        onclone: (clonedDoc, clonedElement) => {
          // 确保克隆的元素可见且尺寸正确
          clonedElement.style.position = 'absolute';
          clonedElement.style.top = '0';
          clonedElement.style.left = '0';
          clonedElement.style.visibility = 'visible';
          clonedElement.style.margin = '0';
          clonedElement.style.overflow = 'visible';
          
          // 为了防止文本在PDF中被切割，为每个元素添加额外的样式
          const allElements = clonedElement.querySelectorAll('*');
          allElements.forEach(el => {
            if (el instanceof HTMLElement) {
              // 确保边距适当
              el.style.margin = el.style.margin || '0 0 10px 0';
              // 尝试避免在页面中间分页
              el.style.pageBreakInside = 'avoid';
            }
          });
        }
      });
      
      // 创建PDF文档(A4纸张)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // 计算尺寸
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // 保持图像比例的宽度，并设置页边距
      const pageMargin = 15; // 页边距15mm
      const imgWidth = pdfWidth - (pageMargin * 2);
      
      // 计算正确的宽高比
      const ratio = canvas.height / canvas.width;
      const imgHeight = imgWidth * ratio;
      
      // 计算每页高度（减去上下边距，底部留出更多空间防止文字被切割）
      const availablePageHeight = pdfHeight - (pageMargin * 2) - 20; // 底部额外留20mm空间，增加了底部边距
      
      // 总内容高度
      const contentHeight = imgHeight;
      // 计算总页数
      const totalPages = Math.ceil(contentHeight / availablePageHeight);
      
      // 逐页添加内容
      for (let i = 0; i < totalPages; i++) {
        // 如果不是第一页，添加新页
        if (i > 0) {
          pdf.addPage();
        }
        
        // 计算当前页显示的部分在原始canvas中的位置和高度
        const pageHeightInCanvas = availablePageHeight / imgHeight * canvas.height;
        // 每页减少一点高度，创建更多的安全边距
        const safePageHeightInCanvas = pageHeightInCanvas * 0.95; // 减少5%的高度
        const sourceY = i * safePageHeightInCanvas;
        
        // 调整高度计算，确保不会切割文本行
        let sourceHeight = Math.min(safePageHeightInCanvas, canvas.height - sourceY);
        
        // 计算在PDF中的显示高度（保持原始比例）
        const targetHeight = sourceHeight / canvas.height * imgHeight;
        
        // 创建临时canvas以裁剪当前部分
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = canvas.width;
        tempCanvas.height = sourceHeight;
        
        // 将原canvas对应部分绘制到临时canvas
        tempCtx?.drawImage(
          canvas, 
          0, sourceY, 
          canvas.width, sourceHeight, 
          0, 0, 
          canvas.width, sourceHeight
        );
        
        // 添加图像切片
        pdf.addImage(
          tempCanvas.toDataURL('image/jpeg', 1.0), 
          'JPEG', 
          pageMargin, 
          pageMargin, 
          imgWidth, 
          targetHeight
        );
        
        // 添加页码
        pdf.setFontSize(10);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`${i + 1}/${totalPages}`, pdfWidth / 2, pdfHeight - 7, { align: 'center' });
      }
      
      // 移除临时容器
      document.body.removeChild(container);
      
      // 保存PDF文件
      pdf.save(`${profile.nickname || '媒体'}_自媒体策划方案.pdf`);
      message.success({ content: 'PDF下载成功', key: 'pdfDownload' });
    } catch (error) {
      console.error('PDF生成错误:', error);
      message.error({ content: 'PDF生成失败，请稍后重试', key: 'pdfDownload' });
    }
  };

  return (
    // 最外层容器，用于控制整个策划方案区域的宽度
    <div className="media-plan-result">
      {/* 使用 Card 组件作为主要容器，提供卡片式的视觉效果和边框阴影 */}
      <Card 
        className="plan-card"
        title={
          // 卡片标题区域，包含左侧标题和右侧操作按钮
          <div className="plan-card-header">
            {/* 左侧标题区域，展示用户昵称和保存状态 */}
            <div className="plan-title-section">
              {/* 使用书本图标 */}
              <div className="plan-title-icon book-icon">
                <BookOutlined className="book-icon-inner" />
              </div>
              <span className="plan-title">{profile.nickname}的专属自媒体策划方案</span>
              {/* 添加私人定制版徽章 */}
              <span className="custom-badge">私人定制版</span>
              {/* 当正在保存时显示保存指示器 */}
              {saving && <span className="saving-indicator">保存中...</span>}
            </div>
            {/* 右侧操作区域，包含生成策划方案按钮 */}
            <div className="plan-actions">
              {/* 生成策划方案按钮，根据是否已有方案显示不同文本 */}
              <Button 
                type="primary" 
                onClick={handleGeneratePlan}
                loading={loading}  // 加载状态时显示加载动画
                disabled={generating}  // 生成过程中禁用按钮防止重复点击
                className="generate-btn"
              >
                {/* 根据是否已有策划方案动态显示按钮文本 */}
                {hasExistingPlan ? '重新生成策划方案' : '生成策划方案'}
              </Button>
            </div>
          </div>
        }
      >
        {/* 卡片内容区域，显示策划方案内容或加载状态 */}
        <div className="plan-content">
          {/* 条件渲染：正在加载且没有内容时显示加载动画 */}
          {loading && !planContent ? (
            <div className="loading-container">
              <Spin tip="正在生成您的专属策划方案..." />
              <Paragraph className="loading-text">
                请耐心等待，我们正在为您精心打造...
              </Paragraph>
            </div>
          // 条件渲染：有内容时显示Markdown渲染结果
          ) : planContent ? (
            <div className="markdown-content">
              {/* 使用ReactMarkdown组件渲染Markdown格式的策划方案 */}
              <div ref={contentRef}>
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}  // 启用GitHub风格的Markdown支持
                  components={{
                    // 自定义各种Markdown元素的渲染样式
                    table: ({node, ...props}) => (
                      <table className="markdown-table" {...props} />
                    ),
                    thead: ({node, ...props}) => (
                      <thead className="markdown-thead" {...props} />
                    ),
                    th: ({node, ...props}) => (
                      <th className="markdown-th" {...props} />
                    ),
                    tr: ({node, ...props}) => (
                      <tr className="markdown-tr" {...props} />
                    ),
                    td: ({node, ...props}) => (
                      <td className="markdown-td" {...props} />
                    ),
                    p: ({node, ...props}) => (
                      <p className="markdown-p" {...props} />
                    ),
                    h1: ({node, ...props}) => (
                      <h1 className="markdown-h1" {...props} />
                    ),
                    h2: ({node, ...props}) => (
                      <h2 className="markdown-h2" {...props} />
                    ),
                    h3: ({node, ...props}) => (
                      <h3 className="markdown-h3" {...props} />
                    ),
                    h4: ({node, ...props}) => (
                      <h4 className="markdown-h4" {...props} />
                    ),
                    ul: ({node, ...props}) => (
                      <ul className="markdown-ul" {...props} />
                    ),
                    ol: ({node, ...props}) => (
                      <ol className="markdown-ol" {...props} />
                    )
                  }}
                >
                  {planContent}
                </ReactMarkdown>
              </div>
              {/* 正在加载更多内容时显示小型加载动画 */}
              {loading && (
                <div className="loading-more">
                  <Spin size="small" />
                  <span className="loading-more-text">正在生成更多内容...</span>
                </div>
              )}
              
              {/* 添加底部操作按钮区域 */}
              {!loading && planContent && (
                <div className="plan-action-buttons">
                  <Button 
                    type="primary"
                    icon={<DownloadOutlined />} 
                    onClick={handleDownloadPDF}
                    className="download-pdf-btn"
                  >
                    下载PDF
                  </Button>
                  <Button 
                    icon={<CopyOutlined />} 
                    onClick={handleCopyText} 
                    loading={copying}
                    className="copy-text-btn"
                  >
                    复制文本
                  </Button>
                </div>
              )}
            </div>
          // 条件渲染：没有内容且不在加载状态时显示空状态
          ) : (
            <div className="empty-plan">
              <Empty 
                description={
                  <span>
                    尚未生成策划方案，点击上方"生成策划方案"按钮开始生成
                  </span>
                }
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default MediaPlanResult;
