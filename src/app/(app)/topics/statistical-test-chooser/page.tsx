
'use client';

import { PageHeader } from '@/components/app/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import React, { useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  type Node,
  type Edge,
  type NodeProps,
} from 'reactflow';
import 'reactflow/dist/style.css';

// --- Data Structure for the Decision Tree ---

type DecisionNodeData = {
  id: string;
  label: string;
  isQuestion?: boolean;
  isResult?: boolean;
  note?: string;
  parent?: string;
  children?: DecisionNodeData[];
};

const treeData: DecisionNodeData = {
  id: 'root',
  label: 'What is your primary goal?',
  isQuestion: true,
  children: [
    {
      id: 'compare',
      label: 'Compare Groups',
      parent: 'root',
      children: [
        {
          id: 'compare-q-count',
          label: 'How many groups?',
          isQuestion: true,
          parent: 'compare',
          children: [
            {
              id: 'one-group',
              label: 'One',
              parent: 'compare-q-count',
              children: [
                {
                  id: 'one-group-q-dist',
                  label: 'Normally Distributed?',
                  isQuestion: true,
                  parent: 'one-group',
                  children: [
                    {
                      id: 'one-t-test',
                      label: 'One-Sample t-test',
                      isResult: true,
                      parent: 'one-group-q-dist',
                    },
                    {
                      id: 'wilcoxon-sr',
                      label: 'Wilcoxon Signed-Rank Test',
                      isResult: true,
                      parent: 'one-group-q-dist',
                    },
                  ],
                },
              ],
            },
            {
              id: 'two-groups',
              label: 'Two',
              parent: 'compare-q-count',
              children: [
                {
                  id: 'two-groups-q-related',
                  label: 'Independent or Paired?',
                  isQuestion: true,
                  parent: 'two-groups',
                  children: [
                    {
                      id: 'independent',
                      label: 'Independent',
                      parent: 'two-groups-q-related',
                      children: [
                        {
                          id: 'ind-q-dist',
                          label: 'Normally Distributed?',
                          isQuestion: true,
                          parent: 'independent',
                          children: [
                            {
                              id: 'ind-t-test',
                              label: 'Independent t-test',
                              isResult: true,
                              parent: 'ind-q-dist',
                            },
                            {
                              id: 'mann-whitney',
                              label: 'Mann-Whitney U Test',
                              isResult: true,
                              parent: 'ind-q-dist',
                            },
                          ],
                        },
                      ],
                    },
                    {
                      id: 'paired',
                      label: 'Paired',
                      parent: 'two-groups-q-related',
                      children: [
                        {
                          id: 'paired-q-dist',
                          label: 'Differences Normal?',
                          isQuestion: true,
                          parent: 'paired',
                          children: [
                            {
                              id: 'paired-t-test',
                              label: 'Paired t-test',
                              isResult: true,
                              parent: 'paired-q-dist',
                            },
                            {
                              id: 'wilcoxon-sr-2',
                              label: 'Wilcoxon Signed-Rank Test',
                              isResult: true,
                              parent: 'paired-q-dist',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: 'three-groups',
              label: 'Three+',
              parent: 'compare-q-count',
              children: [
                {
                  id: 'three-groups-q-related',
                  label: 'Independent or Paired?',
                  isQuestion: true,
                  parent: 'three-groups',
                  children: [
                    {
                      id: 'three-ind',
                      label: 'Independent',
                      parent: 'three-groups-q-related',
                      children: [
                        {
                          id: 'three-ind-q-dist',
                          label: 'Normally Distributed?',
                          isQuestion: true,
                          parent: 'three-ind',
                          children: [
                            {
                              id: 'anova',
                              label: 'One-Way ANOVA',
                              isResult: true,
                              parent: 'three-ind-q-dist',
                            },
                            {
                              id: 'kruskal',
                              label: 'Kruskal-Wallis Test',
                              isResult: true,
                              parent: 'three-ind-q-dist',
                            },
                          ],
                        },
                      ],
                    },
                    {
                      id: 'three-paired',
                      label: 'Paired',
                      parent: 'three-groups-q-related',
                      children: [
                        {
                          id: 'three-paired-q-dist',
                          label: 'Normally Distributed?',
                          isQuestion: true,
                          parent: 'three-paired',
                          children: [
                            {
                              id: 'rm-anova',
                              label: 'Repeated Measures ANOVA',
                              isResult: true,
                              parent: 'three-paired-q-dist',
                            },
                            {
                              id: 'friedman',
                              label: 'Friedman Test',
                              isResult: true,
                              parent: 'three-paired-q-dist',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'relationship',
      label: 'Explore Relationship',
      parent: 'root',
      children: [
        {
          id: 'rel-q-vars',
          label: 'Variable Types?',
          isQuestion: true,
          parent: 'relationship',
          children: [
            {
              id: 'two-numerical',
              label: 'Two Numerical',
              parent: 'rel-q-vars',
              children: [
                {
                  id: 'num-q-linear',
                  label: 'Linear & Normal?',
                  isQuestion: true,
                  parent: 'two-numerical',
                  children: [
                    {
                      id: 'pearson',
                      label: 'Pearson Correlation',
                      isResult: true,
                      parent: 'num-q-linear',
                    },
                    {
                      id: 'spearman',
                      label: 'Spearman Correlation',
                      isResult: true,
                      parent: 'num-q-linear',
                    },
                  ],
                },
              ],
            },
            {
              id: 'two-categorical',
              label: 'Two Categorical',
              parent: 'rel-q-vars',
              children: [
                {
                  id: 'chi-squared',
                  label: 'Chi-Squared Test of Independence',
                  isResult: true,
                  parent: 'two-categorical',
                },
              ],
            },
            {
              id: 'one-num-one-cat',
              label: '1 Num, 1 Cat',
              parent: 'rel-q-vars',
              children: [
                {
                  id: 'converges-note',
                  label: 'Converges with "Compare Groups"',
                  isResult: true,
                  note: 'This is the same as comparing groups. Use t-test for 2 groups, ANOVA for 3+.',
                  parent: 'one-num-one-cat',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'predict',
      label: 'Predict Outcome',
      parent: 'root',
      children: [
        {
          id: 'predict-q-outcome',
          label: 'Predicting What?',
          isQuestion: true,
          parent: 'predict',
          children: [
            {
              id: 'predict-numerical',
              label: 'A Number',
              parent: 'predict-q-outcome',
              children: [
                {
                  id: 'regression',
                  label: 'Linear Regression',
                  isResult: true,
                  parent: 'predict-numerical',
                },
              ],
            },
            {
              id: 'predict-categorical',
              label: 'A Category',
              parent: 'predict-q-outcome',
              children: [
                {
                  id: 'logistic',
                  label: 'Logistic Regression',
                  isResult: true,
                  parent: 'predict-categorical',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

type CustomNodeData = DecisionNodeData & {
  onClick: (id: string, parent?: string) => void;
  active: boolean;
  isPath: boolean;
};

// --- Custom Node Component ---

const CustomNode = ({
  data,
  sourcePosition,
  targetPosition,
}: NodeProps<CustomNodeData>) => {
  return (
    <div
      onClick={() => !data.isResult && data.onClick(data.id, data.parent)}
      className={`
        rounded-md border-2 bg-card p-4 shadow-md transition-all
        ${data.isResult ? 'border-green-500 bg-green-500/10' : ''}
        ${!data.isQuestion && !data.isResult ? 'cursor-pointer' : ''}
        ${data.active ? 'border-primary ring-2 ring-primary' : ''}
        ${!data.isPath && !data.active ? 'opacity-40' : ''}
      `}
    >
      <div className="font-bold">{data.label}</div>
      {data.note && (
        <div className="mt-1 text-xs text-muted-foreground">{data.note}</div>
      )}
      <Handle
        type="target"
        position={targetPosition || Position.Top}
        className="!bg-primary"
      />
      <Handle
        type="source"
        position={sourcePosition || Position.Bottom}
        className="!bg-primary"
      />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

// --- Helper to convert tree to nodes and edges ---
const getLayoutedElements = (
  tree: DecisionNodeData,
  handleNodeClick: (id: string, parentId?: string) => void,
  activeNodeId: string,
  path: Set<string>
) => {
  const initialNodes: Node[] = [];
  const initialEdges: Edge[] = [];
  const nodeWidth = 200;
  const nodeHeight = 80;
  const verticalGap = 50;
  const horizontalGap = 50;

  const calculateSubtreeWidth = (node: DecisionNodeData): number => {
    if (!node.children || node.children.length === 0) {
      return nodeWidth + horizontalGap;
    }
    return node.children.reduce(
      (acc, child) => acc + calculateSubtreeWidth(child),
      0
    );
  };

  const layout = (node: DecisionNodeData, x = 0, y = 0) => {
    const nodeId = node.id;
    const isActive = nodeId === activeNodeId;
    const isPath = path.has(nodeId);

    initialNodes.push({
      id: nodeId,
      type: 'custom',
      data: { ...node, onClick: handleNodeClick, active: isActive, isPath },
      position: { x, y },
    });

    if (node.parent) {
      initialEdges.push({
        id: `e-${node.parent}-${nodeId}`,
        source: node.parent,
        target: nodeId,
        animated: isPath,
        style: {
          stroke: isPath ? 'hsl(var(--primary))' : '#555',
          strokeWidth: isPath ? 2 : 1,
        },
      });
    }

    if (node.children) {
      const totalChildWidth =
        node.children.reduce((sum, child) => sum + calculateSubtreeWidth(child), 0) -
        horizontalGap;
      let startX = x - totalChildWidth / 2 + nodeWidth / 2;

      node.children.forEach((child) => {
        const childWidth = calculateSubtreeWidth(child);
        layout(child, startX + childWidth / 2 - nodeWidth / 2, y + nodeHeight + verticalGap);
        startX += childWidth;
      });
    }
  };

  layout(tree);
  return { initialNodes, initialEdges };
};


// --- Page Component ---

export default function StatisticalTestChooserPage() {
  const [activeNodeId, setActiveNodeId] = useState('root');
  const [path, setPath] = useState<Set<string>>(new Set(['root']));
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const findNode = useCallback(
    (id: string, node: DecisionNodeData = treeData): DecisionNodeData | null => {
      if (node.id === id) return node;
      if (node.children) {
        for (const child of node.children) {
          const found = findNode(id, child);
          if (found) return found;
        }
      }
      return null;
    },
    []
  );

  const handleNodeClick = useCallback(
    (id: string) => {
      const clickedNode = findNode(id);
      if (!clickedNode || !clickedNode.children) return;

      setActiveNodeId(id);

      const newPath = new Set<string>();
      let currentNode: DecisionNodeData | null = clickedNode;
      while (currentNode) {
        newPath.add(currentNode.id);
        currentNode = findNode(currentNode.parent || '');
      }
      setPath(newPath);
    },
    [findNode]
  );

  useEffect(() => {
    const { initialNodes, initialEdges } = getLayoutedElements(treeData, handleNodeClick, activeNodeId, path);
    setNodes(initialNodes);
    setEdges(initialEdges);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNodeId, path]);
  
  const handleReset = () => {
    setActiveNodeId('root');
    setPath(new Set(['root']));
  };

  return (
    <>
      <PageHeader
        title="Statistical Test Decision Map"
        description="Click through the flowchart to find the right statistical test for your needs."
      >
        <Button onClick={handleReset} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </PageHeader>
      <Card className="w-full h-[70vh]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          className="bg-background"
        />
      </Card>
    </>
  );
}

    