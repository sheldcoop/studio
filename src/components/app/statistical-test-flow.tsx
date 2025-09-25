
'use client';

import { PageHeader } from '@/components/app/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import React, { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  type Node,
  type Edge,
  type NodeProps,
  useReactFlow,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { DownloadButton } from './statistical-test-download-button';


// --- Data Structure for the Decision Tree ---

type DecisionNodeData = {
  id: string;
  label: string;
  isQuestion?: boolean;
  isResult?: boolean;
  note?: string;
  parent?: string;
  children?: DecisionNodeData[];
  slug?: string;
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
                      slug: 't-test',
                    },
                    {
                      id: 'wilcoxon-sr',
                      label: 'Wilcoxon Signed-Rank Test',
                      isResult: true,
                      parent: 'one-group-q-dist',
                      slug: 'wilcoxon-signed-rank-test',
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
                              slug: 't-test',
                            },
                            {
                              id: 'mann-whitney',
                              label: 'Mann-Whitney U Test',
                              isResult: true,
                              parent: 'ind-q-dist',
                              slug: 'mann-whitney-u-test',
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
                              slug: 't-test',
                            },
                            {
                              id: 'wilcoxon-sr-2',
                              label: 'Wilcoxon Signed-Rank Test',
                              isResult: true,
                              parent: 'paired-q-dist',
                              slug: 'wilcoxon-signed-rank-test',
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
                              slug: 'anova',
                            },
                            {
                              id: 'kruskal',
                              label: 'Kruskal-Wallis Test',
                              isResult: true,
                              parent: 'three-ind-q-dist',
                              slug: 'kruskal-wallis-test',
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
                              slug: 'anova',
                            },
                            {
                              id: 'friedman',
                              label: 'Friedman Test',
                              isResult: true,
                              parent: 'three-paired-q-dist',
                              slug: 'friedman-test',
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
                      slug: 'pearson-correlation',
                    },
                    {
                      id: 'spearman',
                      label: 'Spearman Correlation',
                      isResult: true,
                      parent: 'num-q-linear',
                      slug: 'spearmans-rank-correlation',
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
                  slug: 'chi-squared-test',
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
                  slug: 'linear-regression',
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
                  slug: 'logistic-regression',
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
  isPath: boolean;
};

// --- Custom Node Component ---

const CustomNode = ({
  data,
  sourcePosition,
  targetPosition,
}: NodeProps<CustomNodeData>) => {
  const router = useRouter();

  const handleNodeClick = (e: React.MouseEvent) => {
    // Prevent click from propagating to the main div if an icon is clicked
    if ((e.target as HTMLElement).closest('.icon-button')) {
      return;
    }
    data.onClick(data.id, data.parent);
  };
  
  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if(data.slug) router.push(`/topics/${data.slug}`);
  }

  return (
    <div
      onClick={handleNodeClick}
      className={`
        group relative w-48 rounded-md border-2 bg-card p-3 shadow-md transition-all text-center text-sm
        ${data.isResult && data.slug ? 'border-green-500 bg-green-500/10' : ''}
        ${data.isResult && !data.slug ? 'border-yellow-500 bg-yellow-500/10' : ''}
        ${!data.isResult && (data.isQuestion || data.children) ? 'cursor-pointer hover:border-primary' : ''}
        ${data.isPath ? 'border-primary ring-2 ring-primary/50' : 'border-border opacity-60 hover:opacity-100'}
        ${data.isQuestion && data.isPath && '!opacity-100 border-dashed'}
      `}
    >
      <div className="font-bold">{data.label}</div>
      {data.note && (
        <div className="mt-1 text-xs text-muted-foreground">{data.note}</div>
      )}
      <Handle
        type="target"
        position={targetPosition || Position.Top}
        className="!bg-primary !h-2 !w-2"
        isConnectable={false}
      />
      <Handle
        type="source"
        position={sourcePosition || Position.Bottom}
        className="!bg-primary !h-2 !w-2"
        isConnectable={false}
      />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

// --- Helper to find a node in the tree ---
const findNode = (
  id: string,
  node: DecisionNodeData = treeData
): DecisionNodeData | null => {
  if (node.id === id) return node;
  if (node.children) {
    for (const child of node.children) {
      const found = findNode(id, child);
      if (found) return found;
    }
  }
  return null;
};


export function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const reactFlowInstance = useReactFlow();
  const router = useRouter();

  const getLayoutedNodes = (nodesToLayout: Node[]): Node[] => {
    const nodeWidth = 192; // w-48
    const nodeHeight = 100; // Adjusted for better vertical spacing
    const horizontalGap = 60;
    const verticalGap = 100;
  
    const levels: { [key: number]: string[] } = {};
    const nodeMap = new Map(nodesToLayout.map(n => [n.id, n]));
  
    nodesToLayout.forEach(node => {
      let level = 0;
      let current = findNode(node.id);
      while(current && current.parent) {
          level++;
          current = findNode(current.parent);
      }
      if (!levels[level]) {
        levels[level] = [];
      }
      levels[level].push(node.id);
    });
  
    const positions: { [key: string]: { x: number; y: number } } = {};
  
    Object.keys(levels).sort((a, b) => parseInt(a) - parseInt(b)).forEach(levelKey => {
      const level = parseInt(levelKey);
      const levelNodes = levels[level];
  
      levelNodes.forEach((nodeId) => {
        const parentId = nodeMap.get(nodeId)?.data.parent;
        const parentX = parentId ? positions[parentId]?.x || 0 : 0;
  
        const parentNode = parentId ? findNode(parentId) : null;
        const siblings = parentNode?.children?.map(c => c.id) || [nodeId];
        const siblingIndex = siblings.indexOf(nodeId);
        
        const siblingsWidth = siblings.length * (nodeWidth + horizontalGap) - horizontalGap;
        const startX = parentX - (siblingsWidth - nodeWidth) / 2;
        const x = startX + siblingIndex * (nodeWidth + horizontalGap);
  
        const y = level * (nodeHeight + verticalGap);
        positions[nodeId] = { x, y };
      });
    });
    
    return nodesToLayout.map(node => ({
      ...node,
      position: positions[node.id] || { x: 0, y: 0 },
    }));
  };

  const handleNodeClick = useCallback((nodeId: string, parentId?: string) => {
      const clickedNodeData = findNode(nodeId);
      if (!clickedNodeData || clickedNodeData.isResult) return;

      if (!clickedNodeData.children) return;
  
      setNodes((currentNodes) => {
        const pathIds = new Set<string>();
        let current: DecisionNodeData | null = clickedNodeData;
        while(current) {
          pathIds.add(current.id);
          current = current.parent ? findNode(current.parent) : null;
        }

        const nodesToKeep = currentNodes.filter(node => pathIds.has(node.id));
        const existingNodeIds = new Set(nodesToKeep.map(n => n.id));
        
        const newNodes: Node[] = [...nodesToKeep];

        clickedNodeData.children!.forEach((childData) => {
          if (!existingNodeIds.has(childData.id)) {
            newNodes.push({
              id: childData.id,
              type: 'custom',
              data: { ...childData, onClick: handleNodeClick, isPath: false },
              position: { x: 0, y: 0 },
            });
          }
        });
        
        const finalNodes = getLayoutedNodes(newNodes);

        setEdges((currentEdges) => {
            const newEdges: Edge[] = [];
            finalNodes.forEach(node => {
                if (node.data.parent) {
                    const edgeId = `e-${node.data.parent}-${node.id}`;
                    newEdges.push({
                        id: edgeId,
                        source: node.data.parent,
                        target: node.id,
                        animated: pathIds.has(node.data.parent),
                        style: { stroke: 'hsl(var(--primary))', strokeWidth: 2 }
                    });
                }
            });
            return newEdges;
        });

        return finalNodes.map(n => ({
            ...n,
            data: {
                ...n.data,
                isPath: pathIds.has(n.id) || n.data.parent === clickedNodeData.id,
            }
        }));
      });
    }, [setNodes, setEdges, router]);
  
  const setInitialState = useCallback(() => {
      const root = findNode('root');
      if (root) {
        const initialNodes: Node[] = [
          {
            id: root.id,
            type: 'custom',
            data: { ...root, onClick: handleNodeClick, isPath: true },
            position: { x: 0, y: 0 },
          },
          ...(root.children?.map(child => ({
            id: child.id,
            type: 'custom',
            data: { ...child, onClick: handleNodeClick, isPath: true },
            position: { x: 0, y: 0 },
          })) || [])
        ];
  
        const initialEdges: Edge[] = root.children?.map(child => ({
            id: `e-${root.id}-${child.id}`,
            source: root.id,
            target: child.id,
            animated: true,
            style: { stroke: 'hsl(var(--primary))', strokeWidth: 2 }
        })) || [];
  
        const layoutedNodes = getLayoutedNodes(initialNodes);
        setNodes(layoutedNodes);
        setEdges(initialEdges);

        if (reactFlowInstance) {
          setTimeout(() => {
             reactFlowInstance.fitView({ padding: 0.2, duration: 200 })
          }, 100);
        }
      }
    }, [setNodes, setEdges, reactFlowInstance, handleNodeClick]);
  

  useEffect(() => {
    setInitialState();
  }, [setInitialState]);


  return (
     <>
       <PageHeader
        title="Statistical Test Decision Map"
        description="Click through the flowchart to find the right statistical test for your needs."
      >
        <div className="flex gap-2">
          <Button onClick={setInitialState} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <DownloadButton />
        </div>
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
          nodesDraggable={false}
          nodesConnectable={false}
          proOptions={{hideAttribution: true}}
        >
        </ReactFlow>
      </Card>
    </>
  );
}
