   M S B A M L   `   `   `  ����  	ThickChat    ThickChat.MainWindow   5   	   \ XPresentationFramework, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35R NWindowsBase, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35W SPresentationCore, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35D 9http://schemas.microsoft.com/winfx/2006/xaml/presentation    5   	   R NSystem.Xaml, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089:x,http://schemas.microsoft.com/winfx/2006/xaml     5   	     � Title$  
MainWindow��5   	   $	��600��6   $	��350��6)   .��5      �  � RowDefinitions 5   
   �� 5      $
��Auto �6   �� 5      $
��Auto �6   �� 5	      $��* �6   �� 5
      $
��Auto �6   .+�5   
   � $��0��6    � ColumnDefinitions 5      �� 5      $
��Auto �6#   �� 5      $��* �6#   .+�5      �� $��0��6   $��Server: ��6$   69   �� 5      -   5         ��Name$ server��5   &   $��1��6   $��http://localhost:14068��66   6s   5      � 5   
   $��1��6    5      �� 5      $
��Auto �6#   �� 5      $��* �6#   .+�5      �� $��0��6   $��
User Name:��6$   6;   �� 5      -   5        $ userName��5   &   $��1��6   $��Thick Client��68   6N   5      �� 5   
   -   5         ��Name$ MessageContainer��5      $��2��6   ��69   ��  �� Path$ Messages� �� UpdateSourceTrigger$ PropertyChanged=�5!      � 5#   
   $��3��6   $��4q�6    5$      �� 5%      $��* �6#   �� 5&      $
��Auto �6#   .+�5(      �� -   5        $ message��5(   &   $��0��6   $��Center=�67   $��4q�6R   �� 5)      -   5        $��1��5)   *   $��Submit!��6:   $��4q�6L   $��Center=�6W   5*      5+      5,      