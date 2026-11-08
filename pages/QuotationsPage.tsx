import React, { useState, useMemo } from 'react';
import { useApp } from '../App';
import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Alert } from '../components/ui/alert';
import { Separator } from '../components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Invoice } from '../components/ui/invoice';
import { CalendarIcon, ChevronRightIcon, EyeIcon, HashIcon, PlusIcon, SaveIcon, SendIcon, TrashIcon, UserIcon } from '../components/ui/icons';

interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export const QuotationsPage: React.FC = () => {
  const { showToast } = useApp();

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [quotationNumber, setQuotationNumber] = useState(`QTN-${Math.floor(Math.random() * 90000) + 10000}`);

  const [items, setItems] = useState<QuotationItem[]>([
    { id: '1', description: 'Enterprise ERP License (Yearly)', quantity: 1, unitPrice: 1200 }
  ]);

  const [taxRate] = useState(15);
  const [previewOpen, setPreviewOpen] = useState(false);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0), [items]);
  const taxAmount = useMemo(() => (subtotal * taxRate) / 100, [subtotal, taxRate]);
  const total = useMemo(() => subtotal + taxAmount, [subtotal, taxAmount]);

  const addItem = () => setItems([...items, { id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0 }]);
  const removeItem = (id: string) => {
    if (items.length === 1) {
      showToast('At least one item is required.', 'error');
      return;
    }
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof QuotationItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const actions = (
    <>
      <Button variant="outline" size="sm" onClick={() => setPreviewOpen(true)}><EyeIcon /> Preview</Button>
      <Button size="sm" onClick={() => showToast('Draft saved.')}><SaveIcon /> Save draft</Button>
    </>
  );

  return (
    <PageLayout
      title="New quotation"
      description={`Draft ${quotationNumber}`}
      actions={actions}
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="grid gap-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Customer profile</CardTitle>
              <CardDescription>Billing identity and document schedule.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="client-name">Business entity</Label>
                <Input id="client-name" placeholder="Acme Corp LLC" leftIcon={<UserIcon />} value={clientName} onChange={(e) => setClientName(e.target.value)} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="client-email">Recipient email</Label>
                <Input id="client-email" type="email" placeholder="billing@acme.com" leftIcon={<SendIcon />} value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="quote-ref">Document ref</Label>
                <Input id="quote-ref" leftIcon={<HashIcon />} value={quotationNumber} onChange={(e) => setQuotationNumber(e.target.value)} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="quote-expiry">Expiration date</Label>
                <Input id="quote-expiry" type="date" leftIcon={<CalendarIcon />} value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-start justify-between">
              <div className="grid gap-1">
                <CardTitle>Service line items</CardTitle>
                <CardDescription>Detailed breakdown of costs.</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={addItem}><PlusIcon /> Add row</Button>
            </CardHeader>
            <CardContent className="grid gap-2">
              <div className="grid grid-cols-[1fr_72px_96px_36px] gap-3 px-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                <span>Description</span>
                <span className="text-center">Qty</span>
                <span className="text-right">Price</span>
                <span />
              </div>
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-[1fr_72px_96px_36px] items-center gap-3 rounded-lg border bg-background p-2 transition-colors hover:border-muted-foreground/30">
                  <Input
                    className="h-9 border-0 bg-transparent shadow-none focus-visible:ring-0"
                    placeholder="Item name…"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                  />
                  <Input
                    type="number"
                    className="h-9 border-0 bg-transparent text-center shadow-none focus-visible:ring-0"
                    value={item.quantity}
                    min={1}
                    onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                  />
                  <div className="text-right">
                    <span className="text-sm font-medium tabular-nums">${(item.quantity * item.unitPrice).toLocaleString()}</span>
                  </div>
                  <Button variant="ghost" size="icon-sm" onClick={() => removeItem(item.id)} aria-label="Remove item">
                    <TrashIcon />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid content-start gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="flex items-center justify-between text-[13px] text-muted-foreground">
                <span>Net subtotal</span>
                <span className="font-medium tabular-nums text-foreground">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-[13px] text-muted-foreground">
                <span>VAT ({taxRate}%)</span>
                <span className="font-medium tabular-nums text-foreground">+${taxAmount.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total payable</span>
                <span className="text-2xl font-semibold tabular-nums text-primary">${total.toLocaleString()}</span>
              </div>
              <Button className="mt-2 w-full">
                Issue document <ChevronRightIcon />
              </Button>
            </CardContent>
          </Card>

          <Alert variant="info" title="Encrypted PDF output">
            Quotes are generated as encrypted PDFs. All revisions are tracked in the system audit logs.
          </Alert>
        </div>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto pt-10">
          <DialogHeader className="sr-only">
            <DialogTitle>Quotation {quotationNumber}</DialogTitle>
            <DialogDescription>Draft quotation preview.</DialogDescription>
          </DialogHeader>
          <Invoice
            number={quotationNumber}
            status="unpaid"
            issued={new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            due={expiryDate || new Date(Date.now() + 14 * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            from={{
              name: 'Aether Systems Inc.',
              lines: ['500 Congress Ave', 'Austin, TX 78701', 'billing@aethererp.com'],
            }}
            to={{
              name: clientName || 'Prospective Client',
              lines: [clientEmail || 'contact@prospect.com'],
            }}
            lines={items
              .filter((item) => item.description.trim())
              .map((item) => ({ description: item.description, qty: item.quantity, price: item.unitPrice }))}
            taxRate={taxRate / 100}
            currency="USD"
            locale="en-US"
            notes="This quote is valid for 14 days from the issue date unless stated otherwise."
            className="border-0 bg-transparent p-0"
          />
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setPreviewOpen(false)}>Close</Button>
            <Button variant="outline" size="sm" onClick={() => { setPreviewOpen(false); showToast('Quotation sent'); }}>
              <SendIcon /> Send
            </Button>
            <Button size="sm" onClick={() => { setPreviewOpen(false); showToast('Quotation downloaded'); }}>
              Download PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};
