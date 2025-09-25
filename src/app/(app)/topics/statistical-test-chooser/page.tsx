
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
      onClick={() => data.isQuestion && data.children && data.onClick(data.id)}
      className={`
        w-48 rounded-md border-2 bg-card p-3 shadow-md transition-all text-center text-sm
        ${data.isResult ? 'border-green-500 bg-green-500/10' : ''}
        ${data.isQuestion ? 'cursor-pointer hover:border-primary' : ''}
        ${data.isPath ? 'border-primary' : ''}
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


// --- Page Component ---

export default function StatisticalTestChooserPage() {
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const setInitialState = useCallback(() => {
    const rootNode = findNode('root');
    if (rootNode) {
      const initialNodes: Node[] = [
        {
          id: rootNode.id,
          type: 'custom',
          data: { ...rootNode, onClick: handleNodeClick, isPath: true },
          position: { x: 0, y: 0 },
        },
      ];
      rootNode.children?.forEach((child, index) => {
        initialNodes.push({
          id: child.id,
          type: 'custom',
          data: { ...child, onClick: handleNodeClick, isPath: false },
          position: { x: -150 + index * 150, y: 150 },
        });
        setEdges((eds) => [
          ...eds,
          { id: `e-root-${child.id}`, source: 'root', target: child.id, animated: false },
        ]);
      });
      setNodes(initialNodes);
      setEdges([]);
    }
  }, [setNodes, setEdges]);
  
  useEffect(() => {
    setInitialState();
  }, [setInitialState]);


  useEffect(() => {
    if (reactFlowInstance) {
      setTimeout(() => reactFlowInstance.fitView({ padding: 0.2, duration: 300 }), 100);
    }
  }, [nodes, reactFlowInstance]);

  const handleNodeClick = useCallback(
    (parentId: string) => {
      const parentNodeData = findNode(parentId);
      if (!parentNodeData || !parentNodeData.children) return;

      setNodes((currentNodes) => {
        // Mark all nodes in the clicked-on parent's children as not being on the path
        const childrenIds = parentNodeData.children?.map(c => c.id) || [];
        const nodesWithPathReset = currentNodes.map(n => 
          childrenIds.includes(n.id) ? { ...n, data: {...n.data, isPath: false}} : n
        );

        // Find the full path to the clicked parent and mark those as `isPath`
        const pathIds = new Set<string>();
        let current: DecisionNodeData | null = parentNodeData;
        while (current) {
          pathIds.add(current.id);
          current = current.parent ? findNode(current.parent) : null;
        }

        let newNodes = nodesWithPathReset.map(n => 
          pathIds.has(n.id) ? { ...n, data: {...n.data, isPath: true}} : n
        );

        const parentNode = newNodes.find(n => n.id === parentId);
        if (!parentNode) return newNodes;

        parentNodeData.children.forEach((childNodeData, index) => {
          // If child already exists, just update its data
          if (newNodes.some(n => n.id === childNodeData.id)) {
            newNodes = newNodes.map(n => n.id === childNodeData.id ? { ...n, data: {...n.data, isPath: true}} : n);
          } else {
            // Add new child node
            newNodes.push({
              id: childNodeData.id,
              type: 'custom',
              data: { ...childNodeData, onClick: handleNodeClick, isPath: true },
              position: { 
                x: parentNode.position.x + (-150 + index * 150), 
                y: parentNode.position.y + 150 
              },
            });
          }

          // Add new edge
          setEdges((eds) => [
            ...eds,
            { id: `e-${parentId}-${childNodeData.id}`, source: parentId, target: childNodeData.id, animated: true },
          ]);
          
          // If the child is a question, reveal its options
          if (childNodeData.isQuestion && childNodeData.children) {
             childNodeData.children.forEach((grandchild, gcIndex) => {
               if(!newNodes.some(n => n.id === grandchild.id)) {
                  newNodes.push({
                    id: grandchild.id,
                    type: 'custom',
                    data: { ...grandchild, onClick: handleNodeClick, isPath: false },
                    position: {
                      x: parentNode.position.x + (-150 + index * 150) + (-100 + gcIndex * 100),
                      y: parentNode.position.y + 300,
                    }
                  });
                  setEdges((eds) => [
                    ...eds,
                    {id: `e-${childNodeData.id}-${grandchild.id}`, source: childNodeData.id, target: grandchild.id, animated: false}
                  ]);
               }
             });
          }
        });
        
        return newNodes;
      });
    },
    [setNodes, setEdges]
  );
  
  const handleReset = () => {
    setInitialState();
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
          onNodesChange={useNodesState([])[1]}
          onEdgesChange={useEdgesState([])[1]}
          nodeTypes={nodeTypes}
          onInit={setReactFlowInstance}
          fitView
          className="bg-background"
          nodesDraggable={false}
          nodesConnectable={false}
          proOptions={{hideAttribution: true}}
        />
      </Card>
    </>
  );
}
